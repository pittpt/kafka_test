import Kafka from 'node-rdkafka';
import eventType from '/Users/pittpongpittayapa/VSCode/kafka_test/eventType2.js';
import https from 'https';

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const producer = Kafka.Producer.createWriteStream(
  {
    'metadata.broker.list': 'localhost:9092',
  },
  {},
  {
    topic: 'test',
  }
);

const topic = 'test';

// function to send API response to Kafka
async function sendApiResponseToKafka() {
  https
    .get('https://api.github.com/repositories', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', async () => {
        const messages = { data };
        const success = producer.write(eventType.toBuffer(messages));
        if (success) {
          console.log(`Message queued (${JSON.stringify(messages)})`);
        } else {
          console.log('Too many messages in the queue already..');
        }
        // producer.produce(messages, (err, data) => {
        //   if (err) {
        //     console.error('Failed to send message to Kafka:', err);
        //   } else {
        //     console.log('Message sent to Kafka:', data);
        //   }
        // });
      });
    })
    .on('error', (err) => {
      console.error('Failed to fetch data from API:', err);
    });
}

setInterval(() => {
  sendApiResponseToKafka();
}, 10);
