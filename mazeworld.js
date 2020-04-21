
// represents a world program that generates and solves mazes
class MazeWorld {
    constructor(nrow, ncol) {
        this.maze = new Maze(nrow, ncol);
        this.nrow = nrow;
        this.ncol = ncol;
        this.currCell = this.maze.getStart();
        this.worklist = new Stack(new Deque());
        this.cameFrom = new HashMap();
        this.foundPath = false;
        this.searchMode = "setup";
        this.showPaths = true;
        this.gradientMode = "none";
        this.pathLength = 0;
        this.showStats = false;
        this.doneConstructing = false;
    }
    ////////////////////////
    // main world methods //
    ////////////////////////

    // advances this world by one tick
    onTick() {
        if (!this.doneConstructing && this.searchMode == "none") {
            this.doneConstructing = this.maze.constructMazeNext(this.nrow, this.ncol);
            if (this.doneConstructing) {
                this.maze.assignDistances(this.maze.getStart(), this.maze.getEnd());
            }
        }
        else if (this.searchMode == "depth" || this.searchMode == "breadth") {
            this.searchStep();
        }
        if (this.foundPath && !this.searchMode == "none") {
            this.backTrackPath();
        }
    }

    // handles key events for this world
    onKeyEvent(key) {
        // setup stage
        if (!this.doneConstructing && this.searchMode == "setup") {
            // choosing no bias (default bias is none)
            if (key == "n") {
                this.searchMode = "none";
            } // choosing horizontal bias
            else if (key == "h") {
                this.searchMode = "none";
                this.maze.setBias("horz");
            } // choosing vertical bias
            else if (key == "v") {
                this.searchMode = "none";
                this.maze.setBias("vert");
            }
        } // main menu
        else if (this.doneConstructing && this.searchMode == "none") {
            // choosing BFS
            if (key == "b") {
                this.setBreadth();
                this.showStats = false;
            } // choosing DFS
            else if (key == "d") {
                this.setDepth();
                this.showStats = false;
            } // choosing manual searching
            else if (key == "m") {
                this.searchMode = "manual";
                this.showStats = false;
                this.currCell = this.maze.getStart();
            } // designing a new maze
            else if (key == "n") {
                this.reset();
            } // showing the maze statistics
            else if (key == "s") {
                // if turning off stats page, reset the maze
                if (this.showStats) {
                    this.resetSearch();
                }
                this.showStats = !this.showStats;
            }
        } // manual movement
        else if (this.doneConstructing && this.searchMode == "manual"
            && (key == "left" || key == "right" || key == "down" || key == "up")) {
            this.manualStep(key);
        }
        // resetting the search
        if (key == "r") {
            this.resetSearch();
        } // toggling the viewing of paths
        else if (key == "p") {
            this.showPaths = !this.showPaths;
        } // toggling gradient mode
        else if (key == "g") {
            if (this.gradientMode == "none") {
                this.gradientMode = "fromStart";
            }
            else if (this.gradientMode == "fromStart") {
                this.gradientMode = "fromExit";
            }
            else if (this.gradientMode == "fromExit") {
                this.gradientMode = "none";
            }
        }
    }

    // renders this world
    makeScene() {
        // draw the maze
        this.maze.drawMaze(this.currCell, this.showPaths, this.gradientMode);
        // opening scene (setting up maze)
        if (this.searchMode == "setup") {
            this.showSetupScreen();
        } // starting screen (main menu)
        else if (this.doneConstructing && this.searchMode == "none" && !this.foundPath
            && !this.showStats) {
            this.showStartingScreen();
        } // stats screen (maze statistics)
        else if (this.searchMode == "none" && this.showStats) {
            this.showStatScreen();
            this.resetSearch();
        } // screen while backtracking
        else if (this.foundPath && !this.currCell == this.maze.getStart()) {
            this.showBacktrackScreen();
        } // end screen
        else if (this.foundPath && this.currCell == this.maze.getStart()) {
            this.showEndScreen();
        }
    }

    //////////////////////////////
    // important helper methods //
    //////////////////////////////

    // performs the next step of searching for this maze
    searchStep() {
        if (!this.foundPath && this.worklist.size() > 0) {
            this.currCell = this.maze.findNextSearch(this.worklist, this.cameFrom);
            this.foundPath = this.currCell == this.maze.getEnd();
        }
    }

    // performs the next manyal step for this maze based on the given direction
    manualStep(dir) {
        if (!this.foundPath) {
            this.currCell = this.maze.findNextManual(dir, this.currCell, this.cameFrom);
            this.foundPath = this.currCell == this.maze.getEnd();
        }
    }

    // performs the next step in backtracking from the exit to the start
    backTrackPath() {
        this.currCell = this.currCell.findCameFrom(this.cameFrom);
        this.currCell.setState("path");
        this.pathLength += 1;
        // done backtracking
        if (this.currCell == this.maze.getStart()) {
            this.searchMode = "none";
        }
    }

    // resets this entirety of this world
    reset() {
        this.currCell = this.maze.getStart();
        this.worklist.clear();
        this.cameFrom.clear();
        this.foundPath = false;
        this.searchMode = "setup";
        this.showPaths = true;
        this.gradientMode = "none";
        this.pathLength = 0;
        this.showStats = false;
        this.maze.reset();
        this.doneConstructing = false;
    }

    // resets the searching aspect of this world, preserving the maze setup
    resetSearch() {
        this.currCell = this.maze.getStart();
        this.worklist.clear();
        this.cameFrom.clear();
        this.foundPath = false;
        this.searchMode = "none";
        this.maze.resetStates();
        this.showPaths = true;
        this.gradientMode = "none";
        this.pathLength = 0;
    }

    // performs the entirety of searching and backtracking for this maze    
    search(searchMode) {
        this.resetSearch();
        this.searchMode = searchMode;
        this.worklist.add(this.maze.getStart());
        while (!this.foundPath) {
            this.searchStep();
        }
        while (!this.searchMode == "none") {
            this.backTrackPath();
        }
    }

    ///////////////////////////////////
    // less important helper methods //
    ///////////////////////////////////


    // prepares this world to perform BFS
    setBreadth() {
        this.searchMode = "breadth";
        this.worklist = new Queue(new Deque());
        this.worklist.add(this.maze.getStart());
    }

    // prepares this world to perform DFS
    setDepth() {
        this.searchMode = "depth";
        this.worklist = new Stack(new Deque());
        this.worklist.add(this.maze.getStart());
    }

    // draws the setup menu
    showSetupScreen() {
    }

    // draws the statistics screen
    showStatScreen() {
    }

    // draws the main manu 
    showStartingScreen() {
    }

    // draws the backtracking text
    showBacktrackScreen() {
    }

    // draws the finished menu screen
    showEndScreen() {
    }

    // returns the number of cells that were visited unnecessarily during the search
    numWrongMoves() {
        return this.maze.numVisited();
    }
}

