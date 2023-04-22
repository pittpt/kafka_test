import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-group' });

async function consumeMessages(topic) {
  await consumer.connect();
  await consumer.subscribe({ topic: topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
      consumer.disconnect();
    },
  });
}

consumeMessages('test');
