// represents a vertex in a graph
function Vertex(pos) {
    this.pos = pos;
    this.outEdges = [];
    this.state = "unvisited";
    this.distFromStart = 0;
    this.distFromExit = 0;

    // adds the given cell to this cell's list of edges
    this.connectTo = function (that) {
        this.outEdges.push(new Edge(this, that));
    };

    // resets all components of this vertex
    this.reset = function () {
        this.outEdges = [];
        this.state = "unvisited";
        this.distFromStart = 0;
        this.distFromExit = 0;
    };

    // returns the rep in the given union/find hashmap for this vertex
    this.findRep = function (reps) {
        return reps.get(this.pos);
    };

    // returns the vertex that this vertex came from, according to the given hashmap
    this.findCameFrom = function (cameFrom) {
        let path = cameFrom.get(this.pos);
        return path.getFrom();
    };

    // adds this vertex's posn to the union/find hashmap
    this.addToHashMap = function (reps) {
        if (!reps.containsKey(this.pos)) {
            reps.put(this.pos, this.pos);
        }
    };

    // adds all of the edges in this vertex to the given list    
    this.addEdgesTo = function (edges) {
        for (const e in this.outEdges) {
            edges.push(e);
        }
    };

    // returns the vertex with the bigger distance from the target
    this.getBiggerDist = function (that, target) {
        if (target == "start" && this.distFromStart > that.distFromStart) {
            return this;
        }
        else if (target == "exit" && this.distFromExit > that.distFromExit) {
            return this;
        }
        else {
            return that;
        }
    };

    // returns a list of all the vertices this vertex is connected to
    this.listNeighbors = function() {
        let neighbors = [];
        for (const e in this.outEdges) {
            e.addOutTo(neighbors);
        }
        return neighbors;
    };

    // draws this vertex
    this.drawCell = function(currentCell, showPaths, gradientMode, biggestFromStart, biggestFromExit) {
        // TO DO
    };

    // visually removes this vertex's walls
    this.drawConnections = function(showPaths, gradientMode, biggestFromStart, biggestFromExit) {

    };

    // is there an edge between this vertex and the neighbor in the given direction?
    this.edgeInDir = function(dir) {
        if (dir =="left") {
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
    };

    // does this vertex have an outEdge with a neighbor at the given position
    this.outEdgeAt = function(neighbor) {
        for (const e in this.outEdges) {
            if (e.outTo(neighbor)) {
                return true;
            }
        }
        return false;
    };

    // has this vertex been visited so far?
    this.beenVisited = function() {
        return this.state == "unvisited";
    };

    // is this vertex part of the path?
    this.inPath = function() {
        return this.state == "path";
    };

    // returns this verex's posn
    this.getPosn = function() {
        return this.pos;
    };

    // sets this vertex's state to the given state
    this.setState = function(state) {
        if (state == "unvisited" || state == "visited" || state == "path") {
            this.state = state;
        }
    };

    // sets this vertex's distance from the given target to the given distance
    this.setDistance = function(distFromTarget, target) {
        if (target == "start") {
            this.distFromStart = distFromTarget;
        } else if (target == "exit") {
            this.distFromExit = distFromTarget;
        }
    };

}

// represents an edge in a graph
function Edge(from, to) {
    this.from = from;
    this.to = to;

    // connects the vertices in this edge, replaces the from rep with the to rep
    this.union = function(reps) {
        let fromRep = this.from.findRep(reps);
        let toRep = this.to.findRep(reps);

        for (const p in reps.keySet()) {
            reps.replace(p, fromRep, toRep);
        }

        // connect the vertices
        this.from.connectTo(this.to);
        this.to.connectTo(this.from);
    };

    // adds this edge's "to" vertex to the given list
    this.addOutTo = function(list) {
        list.push(this.to);
    };

    // do the vertices in this edge have the same rep in the given hashmap?
    this.sameTree = function(reps) {
        return this.from.findRep(reps) == this.to.findRep(reps);
    };

    // is the to vertex in this edge at the given position?
    this.outTo = function(pos) {
        return this.to.getPosn() == pos;
    };

    // returns this edge's from vertex
    this.getFrom = function() {
        return this.from;
    };
    
}