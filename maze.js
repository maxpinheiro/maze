// represents a maze, which is a graph
class Maze {
    constructor(nrow, ncol) {
        this.nrow = nrow;
        this.ncol = ncol;
        this.edgesInTree = [];
        this.vertices = [];
        this.vertices = this.createVertices(nrow, ncol);
        // fields needed for maze construction
        this.representatives = this.listReps();
        this.worklist = this.listAllEdges(nrow, ncol);
        this.worklistIt = new RandomIterator(this.worklist);
    }

    ///////////////////////
    // important methods //
    ///////////////////////

    // performs the next step in constructing the maze
    constructMazeNext(nrow, ncol) {
        if (this.edgesInTree.length < (nrow * ncol) - 1 && this.worklistIt.hasNext()) {
            let e = this.worklistIt.next();

            if (e.sameTree(this.representatives)) {
                // do nothing
            }
            else {
                this.edgesInTree.push(e);
                e.union(this.representatives);
            }
            return false;
        }
        return true;
    }

    // performs the next step of searching for this maze
    findNextSearch(worklist, cameFrom) {
        let target = this.vertices[this.vertices.length - 1];
        let next = worklist.remove();

        if (next.beenVisited()) {
            // do nothing
        }
        else if (next == target) {
            next.setState("path");
        }
        else {
            let neighbors = next.listNeighbors();
            for (let i = 0; i < neighbors.length; i += 1) {
                let v = neighbors[i];
                //if (!cameFrom.has(v.getPosn())) {
                if (!this.mapContainsPosn(cameFrom, v.getPosn())) {
                    worklist.add(v);
                    cameFrom.set(v.getPosn(), new Edge(next, v));
                }
            }
            next.setState("visited");
        }
        return next;
    }

    // does the given map contain the given posn key?
    mapContainsPosn(map, posn) {
        for (let p of map.keys()) {
            if (p.samePosn(posn)) {
                return true;
            }
        }
        return false;
    }

    // performs the next manual step for this maze based on the given direction
    findNextManual(dir, currCell, cameFrom) {
        let next = currCell;
        let currPos = currCell.getPosn();
        // if there's an edge in the given direction - move in that direction
        if (dir == "ArrowLeft" && currCell.edgeInDir("left")) {
            next = this.getCellAt(new Posn(currPos.x - 1, currPos.y));
        }
        else if (dir == "ArrowRight" && currCell.edgeInDir("right")) {
            next = this.getCellAt(new Posn(currPos.x + 1, currPos.y));
        }
        else if (dir == "ArrowUp" && currCell.edgeInDir("up")) {
            next = this.getCellAt(new Posn(currPos.x, currPos.y - 1));
        }
        else if (dir == "ArrowDown" && currCell.edgeInDir("down")) {
            next = this.getCellAt(new Posn(currPos.x, currPos.y + 1));
        }
        // valid move: set next as visited
        if (next != currCell) {
            next.setState("visited");
            // add to map
            //if (!cameFrom.has(next.getPosn())) {
            if (!this.mapContainsPosn(cameFrom, next.getPosn())) {
                cameFrom.set(next.getPosn(), new Edge(currCell, next));
            }
        }
        return next;
    }

    // returns a list of all of the starting, unconnected vertices
    createVertices(nrow, ncol) {
        let vertices = [];
        for (let row = 0; row < nrow; row += 1) {
            for (let col = 0; col < ncol; col += 1) {
                vertices.push(new Vertex(new Posn(col, row)));
            }
        }
        return vertices;
    }

    ////////////////////////////
    // less important methods //
    ////////////////////////////

    // lists all the possible edges in this graph
    listAllEdges(nrow, ncol) {
        let edges = [];
        let size = nrow * ncol;
        // iterates through all vertices
        for (let index = 0; index < size; index += 1) {
            let curr = this.vertices[index];
            let x = index % ncol;
            // vertical edge
            if (x < ncol - 1) {
                edges.push(new Edge(curr, this.vertices[index + 1]));
            }
        }
        // iterates through all vertices
        for (let index = 0; index < size; index += 1) {
            let curr = this.vertices[index];
            let y = Math.floor(index / ncol);
            // horizontal edge
            if (y < nrow - 1) {
                edges.push(new Edge(curr, this.vertices[index + ncol]));
            }
        }
        return edges;
    }

    // returns the map representing the union/find structure
    listReps() {
        if (this.representatives != null) {
            return this.representatives;
        }

        let reps = new Map();
        for (let i = 0; i < this.vertices.length; i += 1) {
            let v = this.vertices[i];
            v.addToHashMap(reps);
        }
        return reps;
    }

    // resets all components of this maze
    reset() {
        this.representatives = null;
        this.representatives = this.listReps();
        this.edgesInTree = [];
        this.worklist = this.listAllEdges(this.nrow, this.ncol);
        this.workListIt = new RandomIterator(this.worklist);
        for (let i = 0; i < this.vertices.length; i += 1) {
            let v = this.vertices[i];
            v.reset();
        }
    }

    // resets the state of every vertex in this maze
    resetStates() {
        for (let i = 0; i < this.vertices.length; i += 1) {
            let v = this.vertices[i];
            v.setState("unvisited");
        }
    }

    // draws this maze
    drawMaze(currPos, showPaths, gradientMode) {
        let biggestFromStart = this.findFarthestFrom("start");
        let biggestFromExit = this.findFarthestFrom("exit");
        // draw vertices
        for (let i = 0; i < this.vertices.length; i += 1) {
            let v = this.vertices[i];
            v.drawCell(false, showPaths, gradientMode, biggestFromStart, biggestFromExit);
        }
        // current cell
        currPos.drawCell(true, showPaths, gradientMode, biggestFromStart, biggestFromExit);
        // top left corner
        fill(30, 128, 69);
        rect(0, 0, TILE_SIZE, TILE_SIZE);
        // bottom right corner
        fill(107, 31, 128);
        rect((this.ncol - 1) * TILE_SIZE, (this.nrow - 1) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        this.drawWalls(showPaths, gradientMode, biggestFromStart, biggestFromExit);
    }

    // draws the connections between vertices in this maze
    drawWalls(showPaths, gradientMode, biggestFromStart, biggestFromExit) {
        // draws each vertex's walls
        for (let i = 0; i < this.vertices.length; i += 1) {
            let v = this.vertices[i];
            v.drawConnections(showPaths, gradientMode, biggestFromStart, biggestFromExit);
        }
    }

    // returns the starting vertex in this maze
    getStart() {
        if (this.vertices.length > 0) {
            return this.vertices[0];
        }
        else {
            return null;
        }
    }

    // returns the exit vertex in this maze
    getEnd() {
        let numVert = this.vertices.length;
        if (numVert > 0) {
            return this.vertices[numVert - 1];
        }
        else {
            return null;
        }
    }

    // returns the cell at the given position (grid coord) 
    getCellAt(pos) {
        for (let i = 0; i < this.vertices.length; i += 1) {
            let v = this.vertices[i];
            if (v.getPosn().samePosn(pos)) {
                return v;
            }
        }
        return null;
    }

    // returns the vertex in this maze that is farthest from the given target
    findFarthestFrom(target) {
        let biggest = this.getStart();
        for (let i = 0; i < this.vertices.length; i += 1) {
            let v = this.vertices[i];
            biggest = v.getBiggerDist(biggest, target);
        }
        return biggest;
    }

    // assigns each vertex its distance from the given target
    assignDistances(start, exit) {
        this.assignDistanceFrom(start, "start");
        this.assignDistanceFrom(exit, "exit");
    }

    // assigns each vertex its distance from the given target
    assignDistanceFrom(target, targetType) {
        let worklist = new Deque();
        worklist.addAtHead(target);
        //let cameFrom = new Map();
        let alreadySeen = [];

        let distFromTarget = 0;
        
        while (worklist.size() > 0) {
            let next = worklist.removeFromHead();
            if (!alreadySeen.includes(next)) {
                next.setDistance(distFromTarget, targetType);
            }

            // add neighbors
            let neighbors = next.listNeighbors();
            
            for (let i = 0; i < neighbors.length; i += 1) {
                let v = neighbors[i];
                //if (!cameFrom.has(v.getPosn())) {
                if (!alreadySeen.includes(v.getPosn())) {
                    worklist.addAtTail(v);
                    //cameFrom.set(v.getPosn, new Edge(next, v));
                    alreadySeen.push(v.getPosn());
                }
            }
            distFromTarget += 1;
        }
    }

    // returns the number of vertices in this maze that have been visited
    numVisited() {
        let count = 0;
        for (let i = 0; i < this.vertices.length; i += 1) {
            let v = this.vertices[i];
            if (v.beenVisited()) {
                count += 1;
            }
        }
        return count;
    }

    // sets the bias for the worklist iterator
    setBias(bias) {
        this.worklistIt = new RandomIterator(this.worklist, bias);
    }
}


// represents an iterator that returns elements randomly
class RandomIterator {
    constructor(list, bias) {
        this.remaining = list;
        this.bias = bias;
        this.remainingHorz = [];
        this.remainingVert = [];
        this.splitList();
        this.divide = 5;
        if (bias == "horz") {
            this.divide = 7;
        }
        else if (bias == "vert") {
            this.divide = 3;
        }
    }
    hasNext() {
        return this.remainingHorz.length + this.remainingVert.length > 0;
    }

    next() {
        if (this.hasNext()) {
            let n = Math.random() * 10;
            let ans = null;
            if (n < this.divide && this.remainingHorz.length > 0
                || n >= this.divide && this.remainingVert.length == 0) {
                let index = floor(Math.random() * this.remainingHorz.length);
                ans = this.remainingHorz[index];
                this.remainingHorz.splice(index, 1);
            }
            else if (n >= this.divide && this.remainingVert.length > 0
                || n < this.divide && this.remainingHorz.length == 0) {
                let index = floor(Math.random() * this.remainingVert.length);
                ans = this.remainingVert[index];
                this.remainingVert.splice(index, 1);
            }
            return ans;
        }
    }
    // seperates the list into horizontal and vertical edges
    splitList() {
        for (let index = 0; index < this.remaining.length; index += 1) {
            if (index < this.remaining.length / 2) {
                this.remainingHorz.push(this.remaining[index]);
            }
            else {
                this.remainingVert.push(this.remaining[index]);
            }
        }
    }

}


// represents a posn
class Posn {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    samePosn(that) {
        return this.x == that.x && this.y == that.y;
    }
}