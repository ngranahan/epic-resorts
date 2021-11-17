# epic-resorts

A serverless function that scrapes `https://www.epicpass.com/passes/epic-pass` to get a list of current all-access resorts on the Epic Pass, then uses the HERE geolocation API to get latitude and longitude for each resort location.

This scraper is built using the [serverless framework](https://www.serverless.com/framework/docs/) and deployed to AWS lambda, which is used to populate a REST API, built with AWS API Gateway.

The AWS API Gateway setup was done following the process outlined by Sarah Drasner, [here](https://www.netlify.com/guides/creating-an-api-with-aws-lambda-dynamodb-and-api-gateway/api-gateway/), and is used in a Vue application that renders the snow report for Epic Pass resorts. For more information about the vue app, see [github.com/ngranahan/epic-snow](https://github.com/ngranahan/epic-snow).

### Local development

Create `env.json` and add HERE API key

```bash
npm i
```

```bash
serverless invoke local --function getResorts
```

### Deployment

```
$ serverless deploy
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function hello
```
