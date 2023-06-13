import AsyncStorage from '@react-native-async-storage/async-storage';

export class Queue {
  constructor(limit) {
    this.limit = limit;
    this.array = [];
    this.loadQueue(); // Load the queue from local storage on instance creation
  }

  async loadQueue() {
    try {
      const queueData = await AsyncStorage.getItem('queue');
      if (queueData) {
        this.array = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Error loading the queue:', error);
    }
  }

  async saveQueue() {
    try {
      await AsyncStorage.setItem('queue', JSON.stringify(this.array));
    } catch (error) {
      console.error('Error saving the queue:', error);
    }
  }

  async enqueue(element) {
    const existingIndex = this.array.findIndex(item => item.city && item.city.id === element.city.id);

    if (existingIndex !== -1) {
      this.array.splice(existingIndex, 1); // Remove existing element
    }

    this.array.push(element);

    if (this.array.length > this.limit) {
      this.array.shift(); // Remove the first element
    }

    await this.saveQueue(); // Save the queue after changes
  }

  displayQueue() {
    console.log(this.array);
  }
}

