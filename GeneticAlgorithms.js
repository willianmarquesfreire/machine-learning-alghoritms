class Individual {
    constructor() {
        this.fitness = 0;
        this.genes = [0, 0, 0, 0, 0];
        this.geneLength = 5;

        for (let i = 0; i < this.genes.length; i++) {
            this.genes[i] = Math.abs(Math.round(Math.random() * 10) % 2);
        }

        this.fitness = 0;
    }

    calcFitness() {
        this.fitness = 0;
        for (let i = 0; i < 5; i++) {
            if (this.genes[i] == 1) {
                ++this.fitness;
            }
        }
    }
}

class Population {
    constructor() {
        this.popSize = 10;
        this.individuals = [];
        this.fittest = 0;
    }

    initializePopulation() {
        for (let i = 0; i < this.popSize; i++) {
            this.individuals[i] = new Individual();
        }
    }

    getFittest() {
        let maxFit = Number.MIN_VALUE;
        let maxFitIndex = 0;
        for (let i = 0; i < this.individuals.length; i++) {
            if (maxFit <= this.individuals[i].fitness) {
                maxFit = this.individuals[i].fitness;
                maxFitIndex = i;
            }
        }
        this.fittest = this.individuals[maxFitIndex].fitness;
        return this.individuals[maxFitIndex]
    }

    getSecondFittest() {
        let maxFit1 = 0;
        let maxFit2 = 0;
        for (let i = 0; i < this.individuals.length; i++) {
            if (this.individuals[i].fitness > this.individuals[maxFit1].fitness) {
                maxFit2 = maxFit1;
                maxFit1 = i;
            } else if (this.individuals[i].fitness > this.individuals[maxFit2].fitness) {
                maxFit2 = i;
            }
        }
        return this.individuals[maxFit2];
    }

    getLeastFittestIndex() {
        let minFitVal = Number.MAX_VALUE;
        let minFitIndex = 0;
        for (let i = 0; i < this.individuals.length; i++) {
            if (minFitVal >= this.individuals[i].fitness) {
                minFitVal = this.individuals[i].fitness;
                minFitIndex = i;
            }
        }
        return minFitIndex;
    }

    calculateFitness() {
        for (let i = 0; i < this.individuals.length; i++) {
            this.individuals[i].calcFitness();
        }
        this.getFittest();
    }
}

class Algorithm {
    constructor() {
        this.population = new Population();
        this.fittest = null;
        this.secondFittest = null;
        this.generationCount = 0;
    }
    run() {
        this.population.initializePopulation();
        this.population.calculateFitness();
        console.log("Generation: " + this.generationCount + " Fittest: " + this.population.fittest)

        while (this.population.fittest < 5) {
            ++this.generationCount;
            this.selection();
            this.crossover();

            let probMutation = Math.abs(Math.round(Math.random() * 10) % 7);
            if (probMutation < 5) {
                this.mutation();
            }

            this.addFittestOffspring();
            this.population.calculateFitness();

            console.log("Generation: " + this.generationCount + " Fittest: " + this.population.fittest);
        }

        console.log("\nSolution found in generation " + this.generationCount);
        console.log("Fitness: " + this.population.getFittest().fitness);
        console.log("Genes: ")
        for (let i = 0; i < 5; i++) {
            console.log(this.population.getFittest().genes[i]);
        }
    }

    selection() {
        this.fittest = this.population.getFittest();
        this.secondFittest = this.population.getSecondFittest();
    }

    crossover() {
        let crossoverPoint = Math.abs(Math.round(Math.random() * this.population.individuals[0].geneLength));
        
        for (let i = 0; i < crossoverPoint; i++) {
            let temp = this.fittest.genes[i];
            this.fittest.genes[i] = this.secondFittest.genes[i];
            this.secondFittest.genes[i] = temp;
        }
    }

    mutation() {
        let mutationPoint = Math.abs(Math.round(Math.random() * this.population.individuals[0].geneLength));
        this.fittest[mutationPoint] = (this.fittest[mutationPoint] == 0) ? 1 : 0;

        mutationPoint = Math.abs(Math.round(Math.random() * this.individuals[0].geneLength));
        this.secondFittest[mutationPoint] = (this.secondFittest[mutationPoint] == 0) ? 1 : 0;
    }

    getFittestOffspring() {
        return (this.fittest.fitness > this.secondFittest.fitness) ? this.fittest : this.secondFittest;
    }

    addFittestOffspring() {
        this.fittest.calcFitness();
        this.secondFittest.calcFitness();

        let leastFittestIndex = this.population.getLeastFittestIndex();
        this.population.individuals[leastFittestIndex] = this.getFittestOffspring();
    }
}

let ag = new Algorithm();
ag.run();