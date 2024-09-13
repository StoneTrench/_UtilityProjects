import { writeFileSync } from "fs";
import { Benchmark, BenchmarkSilent } from "../src/class/benchmark/Benchmark";
import { Goals } from "../src/class/constraints/Goals";
import { Pathfinder } from "../src/class/constraints/Pathfinder";
import { Grid } from "../src/class/grid/Grid";
import { Vector } from "../src/class/math/Vector";
import { Graph } from "../src/class/graph/Graph";

export async function TestPathfinderWFC() {
	console.log("Pathfinder WFC test started!");

	// const tiles = [
	// 	{
	// 		value: "║ ",
	// 		edges: ["#", " ", "#", " "],
	// 	},
	// 	{
	// 		value: "══",
	// 		edges: [" ", "#", " ", "#"],
	// 	},
	// 	{
	// 		value: "╔═",
	// 		edges: [" ", "#", "#", " "],
	// 	},
	// 	{
	// 		value: "╗ ",
	// 		edges: [" ", " ", "#", "#"],
	// 	},
	// 	{
	// 		value: "╚═",
	// 		edges: ["#", "#", " ", " "],
	// 	},
	// 	{
	// 		value: "╝ ",
	// 		edges: ["#", " ", " ", "#"],
	// 	},
	// 	{
	// 		value: "╬═",
	// 		edges: ["#", "#", "#", "#"],
	// 	},
	// 	{
	// 		value: "  ",
	// 		edges: [" ", " ", " ", " "],
	// 	},
	// 	// Slim =======================================
	// 	{
	// 		value: "│ ",
	// 		edges: ["I", " ", "I", " "],
	// 	},
	// 	{
	// 		value: "──",
	// 		edges: [" ", "I", " ", "I"],
	// 	},
	// 	{
	// 		value: "┌─",
	// 		edges: [" ", "I", "I", " "],
	// 	},
	// 	{
	// 		value: "┐ ",
	// 		edges: [" ", " ", "I", "I"],
	// 	},
	// 	{
	// 		value: "└─",
	// 		edges: ["I", "I", " ", " "],
	// 	},
	// 	{
	// 		value: "┘ ",
	// 		edges: ["I", " ", " ", "I"],
	// 	},
	// 	{
	// 		value: "┼─",
	// 		edges: ["I", "I", "I", "I"],
	// 	},
	// ];

	const tiles = [
		{
			value: "║",
			edges: ["#", " ", "#", " "],
		},
		{
			value: "═",
			edges: [" ", "#", " ", "#"],
		},
		{
			value: "╔",
			edges: [" ", "#", "#", " "],
		},
		{
			value: "╗",
			edges: [" ", " ", "#", "#"],
		},
		{
			value: "╚",
			edges: ["#", "#", " ", " "],
		},
		{
			value: "╝",
			edges: ["#", " ", " ", "#"],
		},
		{
			value: "╬",
			edges: ["#", "#", "#", "#"],
		},
		{
			value: "╠",
			edges: ["#", "#", "#", " "],
		},
		{
			value: "╣",
			edges: ["#", " ", "#", "#"],
		},
		{
			value: "╦",
			edges: [" ", "#", "#", "#"],
		},
		{
			value: "╩",
			edges: ["#", "#", " ", "#"],
		},
		{
			value: " ",
			edges: [" ", " ", " ", " "],
		},
	];

	function Generate(goal: Goals.GoalWFC) {
		const path = Pathfinder.FindPath(goal);

		if (path.lastState != undefined) {
			const debugGrid = new Grid<string>("  ");
			debugGrid.setValues(
				new Vector(0, 0),
				goal.size.mapClone((e) => e - 1),
				"  "
			);
			debugGrid.forEach((_, p) => {
				const hash = new Vector(p.x, p.y).toString();
				const tile = goal.tiles[path.lastState.values[hash]];
				if (tile != undefined) debugGrid.set(p, tile.value);
			});
			debugGrid.alterGridPositions((e) => new Vector(e.x, 0, e.y)).printY(0, false);
		}

		const outputGraph = new Graph<undefined, undefined>();

		let memoryCounter = 10000;
		for (const [key, value] of path.edges.entries()) {
			outputGraph.addNode(key, undefined);
			for (const neigh of value) {
				outputGraph.addNode(neigh[0], undefined);
				outputGraph.addEdge(key, neigh[0], undefined);
			}
			memoryCounter--;
			if (memoryCounter < 0) break;
		}

		writeFileSync("./TestPathfinder.graphml", outputGraph.exportToGraphML());
	}

	Generate(new Goals.GoalWFC(new Vector(2, 1).scale(16), tiles));

	// const benches: Promise<string>[] = [];
	// for (let i = 0; i < 10; i++) {
	// 	benches.push(
	// 		(async (index: number) => {
	// 			let line = `${index * index},`;
	// 			const promises: Promise<string>[] = [];
	// 			const goal = new Goals.GoalWFC(new Vector(index, index), tiles);
	// 			for (let k = 0; k < 4; k++) {
	// 				promises.push((async () => `${await BenchmarkSilent(100, Generate, goal)}`)());
	// 			}
	// 			line += `${(await Promise.all(promises)).join(",")}`;
	// 			// console.log(line);
	// 			return line;
	// 		})(i)
	// 	);
	// }
	// console.log("FINAL");
	// console.log((await Promise.all(benches)).join("\n"));
}
