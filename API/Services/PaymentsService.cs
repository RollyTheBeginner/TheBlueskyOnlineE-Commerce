using System;
using API.Entities;
using Stripe;

namespace API.Services;

public class PaymentsService(IConfiguration _configuration)
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
    {
        StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];

        var service = new PaymentIntentService();

        var intent = new PaymentIntent();

        var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);

        var deliveryFee = subtotal > 1000 ? 0 : 50;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(subtotal + deliveryFee),
                Currency = "usd",
                PaymentMethodTypes = ["card"]
            };
            intent = await service.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = (long)(subtotal + deliveryFee)
            };
            await service.UpdateAsync(basket.PaymentIntentId, options);
        }
        return intent;
    }
}
