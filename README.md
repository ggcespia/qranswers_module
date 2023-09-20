# qranswers_module
QR-Answers API module

This module allows you to use nodejs to access the QR-Answers API.

## Webhooks

To use a webhook, create an endpoint (e.g.  https://mydomain.com/qrhook)
In the app, go to Home -> Manage Plan -> Developer to retrieve your API key and Secret Key as well as input your endpoint.  
For the webhook, you need to select which events you would like to receive from the Events to send section.  Choose events from
the dropdown and you will see them appear in a list below.  You may remove any events you no longer want to receive by 
clicking the trash can next to the event and choosing Update Webhook.

Your webhook will need to collect the raw Body (a Buffer) of the request received.  If you use express, you may add this to your file:

```
const bodyParser = require('body-parser')

app.use(
  bodyParser.json({
    verify: function(req, res, buf) {
      req.rawBody = buf;
    }
  })
);
```

Then when you receive the event via a post, you will need to retrieve the ```x-qr-signature``` header and verify the event with the ```qranswers.webhook.constructEvent()``` method.
The method will throw an error if the signature does not match or if the period between the request and the decoding is too long.
You should return a json response to the QR-Answers server like below.

```
app.post('/qrhook', function(req, res) {
  const sig = req.headers['x-qr-signature'];
  let event
  try {
    event = qranswers.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
  } catch (err) {
    console.log('Error', err);
    res.json({error: `Webhook Error: ${err.message}`});
    return;
  }

  switch (event.type) {
    case 'vote.evResponseVote':
      const data = event.data.object;
      console.log('Received event:', event);
      break;
  }

  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});
```

The QR-Answers server(s) will only try 3 times with backoff to deliver your event.  The server determines whether to retry sending the event by examining the 
{success: "xxx"} field in the returned JSON.


## API
