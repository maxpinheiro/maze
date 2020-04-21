// represents a vertex in a graph
class Vertex {
    constructor(pos) {
        this.pos = pos;
        this.outEdges = [];
        this.state = "unvisited";
        this.distFromStart = 0;
        this.distFromExit = 0;
    }
    // adds the given cell to this cell's list of edges
    connectTo(that) {
        this.outEdges.push(new Edge(this, that));
    }

    // resets all components of this vertex
    reset() {
        this.outEdges = [];
        this.state = "unvisited";
        this.distFromStart = 0;
        this.distFromExit = 0;
    }

    // returns the rep in the given union/find hashmap for this vertex
    findRep(reps) {
        return reps.get(this.pos);
    }

    // returns the vertex that this vertex came from, according to the given hashmap
    findCameFrom(cameFrom) {
        let path = cameFrom.get(this.pos);
        return path.getFrom();
    }

    // adds this vertex's posn to the union/find hashmap
    addToHashMap(reps) {
        if (!reps.containsKey(this.pos)) {
            reps.put(this.pos, this.pos);
        }
    }

    // adds all of the edges in this vertex to the given list    
    addEdgesTo(edges) {
        for (let i = 0; i < this.outEdges.length; i += 1) {
            let e = this.outEdges[i];
            edges.push(e);
        }
    }

    // returns the vertex with the bigger distance from the target
    getBiggerDist(that, target) {
        if (target == "start" && this.distFromStart > that.distFromStart) {
            return this;
        }
        else if (target == "exit" && this.distFromExit > that.distFromExit) {
            return this;
        }
        else {
            return that;
        }
    }

    // returns a list of all the vertices this vertex is connected to
    listNeighbors() {
        let neighbors = [];
        for (let i = 0; i < this.outEdges.length; i += 1) {
            let e = this.outEdges[i];
            e.addOutTo(neighbors);
        }
        return neighbors;
    }

    // draws this vertex
    drawCell(currentCell, showPaths, gradientMode, biggestFromStart, biggestFromExit) {
        fill(135, 135, 135);
        if (currentCell) {
            fill(255);
        } // gradient relative to start
        else if (gradientMode == "fromStart") {
            let maxDist = biggestFromStart.distFromStart;
            let scaled = this.distFromStart / maxDist; // [0, 1], 1 = far from start
            scaled *= 255; // 255 = far from start = blue
            fill((int)(255 - scaled), 0, floor(scaled));
        } // gradient relative to exit
        else if (gradientMode == "fromExit") {
            let maxDist = biggestFromExit.distFromExit;
            let scaled = this.distFromExit / maxDist; // [0, 1], 1 = close to end
            scaled *= 255; // 255 = close to end = red
            fill((int)(255 - scaled), 0, floor(scaled));
        } // visited
        else if (this.state == "visited" && showPaths) {
            fill(145, 184, 242);
        } // part of path
        else if (this.state == "path") {
            fill(60, 118, 204);
        }
        // draw cell
        stroke(0);
        rect(this.pos.x * TILE_SIZE, this.pos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    // visually removes this vertex's walls
    drawConnections(showPaths, gradientMode, biggestFromStart, biggestFromExit) {
        fill(135, 135, 135);
        noStroke();
        if (gradientMode == "fromStart") {
            let maxDist = biggestFromStart.distFromStart;
            let scaled = this.distFromStart / maxDist; // [0, 1], 1 = far from start
            scaled *= 255; // 255 = far from start = blue
            fill((int)(255 - scaled), 0, floor(scaled));
        } // gradient relative to exit
        else if (gradientMode == "fromExit") {
            let maxDist = biggestFromExit.distFromExit;
            let scaled = this.distFromExit / maxDist; // [0, 1], 1 = close to end
            scaled *= 255; // 255 = close to end = red
            fill((int)(255 - scaled), 0, floor(scaled));
        } // visited
        else if (this.state == "visited" && showPaths) {
            fill(145, 184, 242);
        } // part of path
        else if (this.state == "path") {
            fill(60, 118, 204);
        }
        // connection to the right: cover right wall
        if (this.edgeInDir("right")) {
            rect((this.pos.x + 1) * TILE_SIZE, thie.pos.y * TILE_SIZE + 1, 2, TILE_SIZE - 1);
        }
        // connection to the right: cover right wall
        if (this.edgeInDir("down")) {
            rect(this.pos.x * TILE_SIZE + 1, (this.pos.y + 1) * TILE_SIZE, TILE_SIZE - 1, 2);
        }
    }

    // is there an edge between this vertex and the neighbor in the given direction?
    edgeInDir(dir) {
        if (dir == "left") {
            return this.outEdgeAt(new Posn(this.pos.x - 1, this.pos.y));
        }
        else if (dir == "right") {
            return this.outEdgeAt(new Posn(this.pos.x + 1, this.pos.y));
        }
        else if (dir == "up") {
            return this.outEdgeAt(new Posn(this.pos.x, this.pos.y - 1));
        }
        else if (dir == "down") {
            return this.outEdgeAt(new Posn(this.pos.x, this.pos.y + 1));
        }
    }

    // does this vertex have an outEdge with a neighbor at the given position
    outEdgeAt(neighbor) {
        for (let i = 0; i < this.outEdges.length; i += 1) {
            let e = this.outEdges[i];
            if (e.outTo(neighbor)) {
                return true;
            }
        }
        return false;
    }

    // has this vertex been visited so far?
    beenVisited() {
        return this.state == "unvisited";
    }

    // is this vertex part of the path?
    inPath() {
        return this.state == "path";
    }

    // returns this verex's posn
    getPosn() {
        return this.pos;
    }

    // sets this vertex's state to the given state
    setState(state) {
        if (state == "unvisited" || state == "visited" || state == "path") {
            this.state = state;
        }
    }

    // sets this vertex's distance from the given target to the given distance
    setDistance(distFromTarget, target) {
        if (target == "start") {
            this.distFromStart = distFromTarget;
        }
        else if (target == "exit") {
            this.distFromExit = distFromTarget;
        }
    }
}


// represents an edge in a graph
class Edge {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    // connects the vertices in this edge, replaces the from rep with the to rep
    union(reps) {
        let fromRep = this.from.findRep(reps);
        let toRep = this.to.findRep(reps);
        let keySet = reps.keySet();

        for (let i = 0; i < keySet.length; i += 1) {
            let p = keySet[i];
            reps.replace(p, fromRep, toRep);
        }
        // connect the vertices
        this.from.connectTo(this.to);
        this.to.connectTo(this.from);
    }

    // adds this edge's "to" vertex to the given list
    addOutTo(list) {
        list.push(this.to);
    }

    // do the vertices in this edge have the same rep in the given hashmap?
    sameTree(reps) {
        return this.from.findRep(reps) == this.to.findRep(reps);
    }

    // is the to vertex in this edge at the given position?
    outTo(pos) {
        return this.to.getPosn() == pos;
    }

    // returns this edge's from vertex
    getFrom() {
        return this.from;
    };
}
