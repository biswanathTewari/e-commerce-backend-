var braintree = require("braintree");

var gateway = braintree.connect({
   environment: braintree.Environment.Sandbox,
   merchantId: "25y4hvgq8pfzr44r",
   publicKey: "9styxwskq97bcsyq",
   privateKey: "06edafa446f1d4cb23dfc2a8ce696b72",
});

exports.getToken = (req, res) => {
   gateway.clientToken.generate({}, function (err, response) {
      if (err) {
         res.status(500).send(err);
      } else {
         res.send(response);
      }
   });
};

exports.processPayment = (req, res) => {
   let nonceFromTheClient = req.body.paymentMethodNonce;
   let amountFromTheClient = req.body.amount;
   gateway.transaction.sale(
      {
         amount: amountFromTheClient,
         paymentMethodNonce: nonceFromTheClient,
         options: {
            submitForSettlement: true,
         },
      },
      function (err, result) {
         if (err) {
            res.status(500).json(err);
         } else {
            res.send(result);
         }
      }
   );
};
