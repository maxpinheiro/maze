// represents a maze, which is a graph
function Maze(nrow, ncol) {
    this.nrow = nrow;
    this.ncol = ncol;
    this.vertices = this.createVertices(nrow, ncol);
    // fields needed for maze construction
    this.representatives = this.listReps();
    this.edgesInTree = [];
    this.worklist = this.listAllEdges(nrow, ncol);
    this.workListIt = new RandomIterator(worklsist);

    ///////////////////////
    // important methods //
    ///////////////////////

    // performs the next step in constructing the maze
    this.constructMazeNext = function (nrow, ncol) {
        if (this.edgesInTree.length < (nrow * ncol) - 1 && this.worklistIt.hasNext()) {
            let e = this.worklistIt.next();

            if (e.sameTree(this.representatives)) {
                // do nothing
            }
            else {
                this.edgesInTree.add(e);
                e.union(this.representatives);
            }

            return false;
        }

        return true;
    };

    // performs the next step of searching for this maze
    this.findNextSearch = function (worklist, cameFrom) {
        let target = this.vertices.get(this.vertices.size() - 1);
        let next = worklist.remove();

        if (next.beenVisited()) {
            // do nothing
        }
        else if (next.equals(target)) {
            next.setState("path");
        }
        else {
            let neighbors = next.listNeighbors();
            for (const v in neighbors) {
                // if (!cameFrom.containsKey(v.getPosn()) && !this.getStart().equals(v)) {
                if (!cameFrom.containsKey(v.getPosn())) {
                    worklist.add(v);
                    cameFrom.put(v.getPosn(), new Edge(next, v));
                }
            }
            next.setState("visited");
        }

        return next;
    };

    // performs the next manual step for this maze based on the given direction
    this.findNextManual = function (dir, currCel, cameFrom) {
        let next = currCell;
        let currPos = currCell.getPosn();

        // if there's an edge in the given direction - move in that direction
        if (dir == "left" && currCell.edgeInDir("left")) {
            next = this.getCellAt(new Posn(currPos.x - 1, currPos.y));
        }
        else if (dir == "right" && currCell.edgeInDir("right")) {
            next = this.getCellAt(new Posn(currPos.x + 1, currPos.y));
        }
        else if (dir == "up" && currCell.edgeInDir("up")) {
            next = this.getCellAt(new Posn(currPos.x, currPos.y - 1));
        }
        else if (dir == "down" && currCell.edgeInDir("down")) {
            next = this.getCellAt(new Posn(currPos.x, currPos.y + 1));
        }

        // valid move: set next as visited
        if (next != currCell) {

            next.setState("visited");
            // add to hashmap
            if (!cameFrom.containsKey(next.getPosn())) {
                cameFrom.put(next.getPosn(), new Edge(currCell, next));
            }
        }

        return next;
    };

    // returns a list of all of the starting, unconnected vertices
    this.createVertices = function (nrow, ncol) {
        let vertices = [];
        for (let row = 0; row < nrow; row += 1) {
            for (let col = 0; col < ncol; col += 1) {
                vertices.push(new Vertex(new Posn(col, row)));
            }
        }
        return vertices;
    };

    ////////////////////////////
    // less important methods //
    ////////////////////////////

    // lists all the possible edges in this graph
    this.listAllEdges = function (nrow, ncol) {
        let edges = [];
        let size = nrow * ncol;

        // iterates through all vertices
        for (let index = 0; index < size; index += 1) {
            let curr = this.vertices.get(index);
            let x = index % col;

            // vertical edge
            if (x < ncol - 1) {
                edges.push(new Edge(curr, this.vertices.get(index + 1)));
            }
        }

        // iterates through all vertices
        for (let index = 0; index < size; index += 1) {
            let curr = this.vertices.get(index);
            let y = Math.floor(index / ncol);

            // horizontal edge
            if (y < nrow - 1) {
                edges.push(new Edge(curr, this.vertices.get(index + ncol)));
            }
        }

        return edges;
    };

    // returns the hashmap representing the union/find structure
    this.listReps = function () {
        if (this.representatives != null) {
            return this.representatives;
        }

        let reps = new HashMap();

        for (const v in this.vertices) {
            v.addToHashMap(reps);
        }

        return reps;
    };

    // resets all components of this maze
    this.reset = function () {
        this.representatives = null;
        this.representatives = this.listReps();
        this.edgesInTree = [];
        this.worklist = this.listAllEdges(nrow, ncol);
        this.workListIt = new RandomIterator(worklist);
        for (const v in this.vertices) {
            v.reset();
        }
    };

    // resets the state of every vertex in this maze
    this.resetStates = function () {
        for (const v in this.vertices) {
            v.setState("unvisited");
        }
    };

    // draws this maze
    this.drawMaze = function (currPos, showPaths, gradientMode) {

    };

    // draws the connections between vertices in this maze
    this.drawWalls = function (showPaths, gradientMode, biggestFromStart, biggestFromExit) {

    };

    // returns the starting vertex in this maze
    this.getStart = function () {
        if (this.vertices.length > 0) {
            return this.vertices[0];
        } else {
            return null;
        }
    };

    // returns the exit vertex in this maze
    this.getEnd = function () {
        let numVert = this.vertices.length;
        if (numVert > 0) {
            return this.vertices[numVert - 1];
        } else {
            return null;
        }
    };

    // returns the cell at the given position (grid coord) 
    this.getCellAt = function (pos) {
        for (const v in this.vertices) {
            if (v.getPosn() == pos) {
                return v;
            }
        }
        return null;
    };

    // returns the vertex in this maze that is farthest from the given target
    this.findFarthestFrom = function (target) {
        let biggest = this.getStart();
        for (const v in this.vertices) {
            biggest = v.getBiggerDist(biggest, target);
        }
        return biggest;
    };

    // assigns each vertex its distance from the given target
    this.assignDistances = function (start, exit) {
        this.assignDistanceFrom(start, "start");
        this.assignDistanceFrom(exit, "exit");
    };

    // assigns each vertex its distance from the given target
    this.assignDistanceFrom = function (target, targetType) {
        let worklist = new Deque();
        worklist.addAtHead(target);
        let cameFrom = new HashMap();

        let distFromTarget = 0;

        while (worklist.size() > 0) {
            let next = worklist.removeFromHead();
            next.setDistance(distFromTarget, targetType);

            // add neighbors
            let neighbors = next.listNeighbors();
            for (const v in neighbors) {
                if (!cameFrom.containsKey(v.getPosn())) {
                    worklist.addAtTail(v);
                    cameFrom.put(v.getPosn, new Edge(next, v));
                }
            }

            distFromTarget += 1;
        }
    };

    // returns the number of vertices in this maze that have been visited
    this.numVisited = function () {
        let count = 0;
        for (const v in this.vertices) {
            if (v.beenVisited()) {
                count += 1;
            }
        }
        return count;
    };

}

// represents an iterator that returns elements randomly
function RandomIterator(list, bias) {
    this.remaining = list;
    this.bias = bias;
    this.remainingHorz = [];
    this.remainingVert = [];
    this.splitList();

    this.divide = 5;
    if (bias == "horz") {
        this.divide = 7;
    } else if (bias == "vert") {
        this.divide = 3;
    }

    this.hasNext = function () {
        return this.remainingHorz.length + this.remainingVert.length > 0;
    };

    this.next = function () {
        if (this.hasNext()) {
            let n = Math.random() * 10;
            let ans = null;

            if (n < divide && this.remainingHorz.length > 0
                || n >= divide && this.remainingVert.length == 0) {
                let index = Math.random() * this.remainingHorz.length;
                ans = this.remainingHorz.get(index);
                this.remainingHorz.remove(index);
            }
            else if (n >= divide && this.remainingVert.length > 0
                || n < divide && this.remainingHorz.length == 0) {
                let index = Math.random() * this.remainingVert.length;
                ans = this.remainingVert.get(index);
                this.remainingVert.remove(index);
            }

            return ans;
        }
    };

    // seperates the list into horizontal and vertical edges
    this.splitList = function () {
        for (let index = 0; index < this.remaining.length; index += 1) {
            if (index < this.remaining.length / 2) {
                this.remainingHorz.push(this.remaining[index]);
            } else {
                this.remainingVert.push(this.remaining[index]);
            }
        }
    };
}

// represents a posn
function Posn(x, y) {
    this.x = x;
    this.y = y;
}
