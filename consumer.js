import Kafka from 'node-rdkafka';
import eventType from '/Users/pittpongpittayapa/VSCode/kafka_test/eventType.js';

var consumer = new Kafka.KafkaConsumer(
  {
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092',
  },
  {}
);

consumer.connect();

consumer
  .on('ready', () => {
    console.log('consumer ready..');
    consumer.subscribe(['test']);
    consumer.consume();
  })
  .on('data', function (data) {
    console.log(`Received message: ${eventType.fromBuffer(data.value)}`);
  });
