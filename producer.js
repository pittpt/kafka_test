import { Kafka } from 'kafkajs';
import https from 'https';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const produceMessage = async () => {
  try {
    const options = {
      hostname: 'api.github.com',
      path: '/repositories',
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', async () => {
        const message = {
          value: JSON.stringify(data),
        };
        await producer.connect();
        await producer.send({
          topic: 'test',
          messages: [message],
        });
        // messages: [{ value: 'Hello KafkaJS!' }],

        console.log('Message sent successfully!');
        await producer.disconnect();
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });

    req.end();
  } catch (err) {
    console.error('Error sending message: ', err);
  }
  // finally {
  //   await producer.disconnect();
  // }
};

produceMessage();

// setInterval(() => {
//   produceMessage();
// }, 1000);
