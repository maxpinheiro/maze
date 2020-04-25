// represents a stack
class Stack {
    // constructor
    constructor(list) {
        this.list = list;
    }

    // adds the data to this stack
    add(data) {
        this.list.addAtTail(data);
    }

    // removes an element from this stack
    remove() {
        return this.list.removeFromTail();
    }

    // removes all elements from this stack
    clear() {
        this.list.clear();
    }

    // returns the number of elements in this stack
    size() {
        return this.list.size();
    }
}

// represents a stack
class Queue {
    // constructor
    constructor(list) {
        this.list = list;
    }

    // adds the data to this stack
    add(data) {
        this.list.addAtTail(data);
    }

    // removes an element from this stack
    remove() {
        return this.list.removeFromHead();
    }

    // removes all elements from this stack
    clear() {
        this.list.clear();
    }

    // returns the number of elements in this queue
    size() {
        return this.list.size();
    }
}

// represents a stack
class Deque {
    // constructor
    constructor() {
        this.header = new Sentinel();
    }

    // adds the data to the front of this deque
    addAtHead(data) {
        this.header.addAfterHead(data);
    }

    // adds the data to the back of this deque
    addAtTail(data) {
        this.header.addAtEnd(data);
    }

    // removes the first node in this deque
    removeFromHead() {
        return this.header.removeFirst();
    }

    // removes the last node in this deque
    removeFromTail() {
        return this.header.removeLast();
    }

    // removes all elements from this deque
    clear() {
        this.header.next = this.header;
        this.header.prev = this.header;
    }

    // returns the size of this deque
    size() {
        return this.header.countNodes(this.header);
    }

}

// represents a sentinel
class Sentinel {
    // constructor
    constructor() {
        this.next = this;
        this.prev = this;
    }

    // adds the data after this sentinel
    addAfterHead(data) {
        new Node(data, this.next, this);
    }

    // adds the data before this sentinel
    addAtEnd(data) {
        new Node(data, this, this.prev);
    }

    // removes the data after this sentinel
    removeFirst() {
        return this.next.removeThis();
    }

    // removes the data before this sentinel
    removeLast() {
        return this.prev.removeThis();
    }

    // returns the number of nodes in this cycle
    countNodes(start) {
        if (this.next == start) {
            return 0;
        } else {
            return 1 + this.next.countNodes(start);
        }
    }
}

// represents a node
class Node {
    // constructor
    constructor(data, next, prev) {
        this.next = next;
        this.prev = prev;
        this.data = data;

        if (next != null && prev != null) {
            next.prev = this;
            prev.next = this;
        }
    }

    // removes this node from the cycle
    removeThis() {
        let removed = this.data;

        this.prev.next = this.next;
        this.next.prev = this.prev;

        return removed;
    }

    // returns the number of nodes in this cycle
    countNodes(start) {
        if (this.next == start) {
            return 0;
        } else {
            return 1 + this.next.countNodes(start);
        }
    }
}