import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!) ;

export async function createDashboardLink(stripeAccountId: string) {
    try {
        const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
        return loginLink.url;
    } catch (error) {
        console.error('Error creating dashboard link:', error);
        return null;
    }
}

