import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
    };
  }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses[0].emailAddress) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        courseId_userId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (!course) {
      return new NextResponse("This course doesn't exist", {
        status: 404,
      });
    }

    if (purchase) {
      return new NextResponse("This course is already purchased", {
        status: 400,
      });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        // only fetch this field
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
            userId: user.id,
            stripeCustomerId: customer.id,
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
        metadata: {
            userId: user.id,
            courseId: course.id
        }
    });

    return NextResponse.json({
        url: session.url
    });

  } catch (error) {
    console.log("COURSE CHECKOUT ERROR ", error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
