document.addEventListener("DOMContentLoaded", function () {
	const LiquidButton = class LiquidButton {
		constructor(svg) {
			const options = svg.dataset;
			this.id = this.constructor.id || (this.constructor.id = 1);
			this.constructor.id++;
			this.xmlns = "http://www.w3.org/2000/svg";
			this.tension = options.tension * 1 || 0.5;
			this.width = options.width * 1 || 500;
			this.height = options.height * 1 || 500;
			this.margin = options.margin || 15;
			this.hoverFactor = options.hoverFactor || 0;
			this.gap = options.gap || 50;
			this.debug = options.debug || false;
			this.forceFactor = options.forceFactor || 0.4;
			this.color1 = options.color1 || "#36DFE7";
			this.srcImage = options.imgSrc;
			this.svg = svg;
			this.layers = [
				{
					points: [],
					viscosity: 0.5,
					mouseForce: 200,
					forceLimit: 1,
				},
			];

			this.svgClipPath = document.createElementNS(this.xmlns, "clipPath");
			this.svgClipPath.setAttribute("id", `test${this.id}`);
			this.svg.appendChild(this.svgClipPath);

			const layer = this.layers[0];
			layer.viscosity = options["layer-" + (0 + 1) + "Viscosity"] * 1 || layer.viscosity;
			layer.mouseForce = options["layer-" + (0 + 1) + "MouseForce"] * 1 || layer.mouseForce;
			layer.forceLimit = options["layer-" + (0 + 1) + "ForceLimit"] * 1 || layer.forceLimit;
			layer.path = document.createElementNS(this.xmlns, "path");
			this.svgClipPath.appendChild(layer.path);

			this.svgImage = document.createElementNS(this.xmlns, "image");
			this.svgImage.setAttributeNS(null, "width", "100%");
			this.svgImage.setAttributeNS(null, "height", "100%");
			this.svgImage.setAttributeNS(null, "clip-path", `url(#test${this.id})`);
			this.svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "preserveAspectRatio", "xMidYMid slice");
			this.svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `${this.srcImage}`);
			this.svg.appendChild(this.svgImage);

			this.wrapperElement = options.wrapperElement || document.body;
			if (!this.svg.parentElement) {
				this.wrapperElement.append(this.svg);
			}

			this.svgDefs = document.createElementNS(this.xmlns, "defs");
			this.svg.appendChild(this.svgDefs);

			this.touches = [];
			this.noise = options.noise || 0;

			// this.svg.addEventListener("mousemove", this.mouseHandler);
			// this.svg.addEventListener("mouseout", this.clearHandler);

			// document.addEventListener("mousemove", this.mouseHandler);
			// document.addEventListener("mousemove", this.clearHandler);

			this.initOrigins();
			this.animate();
		}

		mouseHandler(x, y) {
			this.touches = [
				{
					x: x,
					y: y,
					force: 1,
				},
			];
			// console.log(this.touches);
		}

		clearHandler() {
			this.touches = [];
		}

		get raf() {
			return (
				this.__raf ||
				(this.__raf = (
					window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					function (callback) {
						setTimeout(callback, 10);
					}
				).bind(window))
			);
		}

		distance(p1, p2) {
			return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
		}

		update() {
			const layer = this.layers[0];
			const points = layer.points;
			for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
				const point = points[pointIndex];
				const dx = point.ox - point.x + (Math.random() - 0.5) * this.noise;
				const dy = point.oy - point.y + (Math.random() - 0.5) * this.noise;
				const d = Math.sqrt(dx * dx + dy * dy);
				const f = d * this.forceFactor;
				point.vx += f * (dx / d || 0);
				point.vy += f * (dy / d || 0);
				for (let touchIndex = 0; touchIndex < this.touches.length; touchIndex++) {
					const touch = this.touches[touchIndex];
					let mouseForce = layer.mouseForce;
					if (touch.x > this.margin && touch.x < this.margin + this.width && touch.y > this.margin && touch.y < this.margin + this.height) {
						mouseForce *= -this.hoverFactor;
					}
					const mx = point.x - touch.x;
					const my = point.y - touch.y;
					const md = Math.sqrt(mx * mx + my * my);
					const mf = Math.max(-layer.forceLimit, Math.min(layer.forceLimit, (mouseForce * touch.force) / md));
					point.vx += mf * (mx / md || 0);
					point.vy += mf * (my / md || 0);
				}
				point.vx *= layer.viscosity;
				point.vy *= layer.viscosity;
				point.x += point.vx;
				point.y += point.vy;
			}
			for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
				const prev = points[(pointIndex + points.length - 1) % points.length];
				const point = points[pointIndex];
				const next = points[(pointIndex + points.length + 1) % points.length];
				const dPrev = this.distance(point, prev);
				const dNext = this.distance(point, next);

				const line = {
					x: next.x - prev.x,
					y: next.y - prev.y,
				};
				const dLine = Math.sqrt(line.x * line.x + line.y * line.y);

				point.cPrev = {
					x: point.x - (line.x / dLine) * dPrev * this.tension,
					y: point.y - (line.y / dLine) * dPrev * this.tension,
				};
				point.cNext = {
					x: point.x + (line.x / dLine) * dNext * this.tension,
					y: point.y + (line.y / dLine) * dNext * this.tension,
				};
			}
		}

		animate() {
			this.raf(() => {
				this.update();
				this.draw();
				this.animate();
			});
		}

		get svgWidth() {
			return this.width + this.margin * 2;
		}

		get svgHeight() {
			return this.height + this.margin * 2;
		}

		draw() {
			const layer = this.layers[0];

			if (0 === 0) {
				layer.path.style.stroke = this.color1;
				layer.path.style.fill = "none";
			}

			const points = layer.points;
			const commands = [];
			commands.push("M", points[0].x, points[0].y);
			for (let pointIndex = 1; pointIndex < points.length; pointIndex += 1) {
				commands.push("C", points[(pointIndex + 0) % points.length].cNext.x, points[(pointIndex + 0) % points.length].cNext.y, points[(pointIndex + 1) % points.length].cPrev.x, points[(pointIndex + 1) % points.length].cPrev.y, points[(pointIndex + 1) % points.length].x, points[(pointIndex + 1) % points.length].y);
			}
			commands.push("Z");
			layer.path.setAttribute("d", commands.join(" "));
		}

		createPoint(x, y) {
			return {
				x: x,
				y: y,
				ox: x,
				oy: y,
				vx: 0,
				vy: 0,
			};
		}

		initOrigins() {
			this.svg.setAttribute("width", this.svgWidth);
			this.svg.setAttribute("height", this.svgHeight);
			const layer = this.layers[0];
			const points = [];
			// for (let x = ~~(this.height / 2); x < this.width - ~~(this.height / 2); x += this.gap) {
			// 	points.push(this.createPoint(x + this.margin, this.margin));
			// 	console.log(points);
			// }

			for (let x = 0; x <= ~~this.width; x += this.gap) {
				points.push(this.createPoint(x + this.margin, this.margin));
			}

			for (let y = 0; y <= ~~this.height; y += this.gap) {
				points.push(this.createPoint(~~this.width + this.margin, y + this.margin));
			}

			for (let x = ~~this.width; x >= 0; x -= this.gap) {
				points.push(this.createPoint(x + this.margin, ~~this.height + this.margin));
			}

			for (let y = ~~this.height; y >= 0; y -= this.gap) {
				points.push(this.createPoint(this.margin, y + this.margin));
			}

			// for (let x = 0; x <= ~~this.width; x += this.gap) {
			// 	points.push(this.createPoint(x + this.margin, this.margin));
			// }

			// for (let x = 0; x <= ~~this.width; x += this.gap) {
			// 	points.push(this.createPoint(x + this.margin, this.height + this.margin));
			// }

			// for (let y = 0; y <= ~~this.height; y += this.gap) {
			// 	points.push(this.createPoint(this.width + this.margin, y + this.margin));
			// }

			// for (let y = 0; y <= ~~this.height; y += this.gap) {
			// 	points.push(this.createPoint(this.margin, y + this.margin));
			// }

			// for (let alpha = ~~(this.height * 1.25); alpha >= 0; alpha -= this.gap) {
			// 	const angle = (Math.PI / ~~(this.height * 1.25)) * alpha;
			// 	console.log(this.height / 2 + this.margin + this.height / 2);
			// 	points.push(
			//         this.createPoint(
			//             (Math.sin(angle) * this.height) / 2 + this.margin + this.width - this.height / 2,
			//             (Math.cos(angle) * this.height) / 2 + this.margin + this.height / 2
			//         )
			//     );
			// }
			// for (let x = this.width - ~~(this.height / 2) - 1; x >= ~~(this.height / 2); x -= this.gap) {
			// 	points.push(this.createPoint(x + this.margin, this.margin + this.height));
			// }
			// for (let alpha = 0; alpha <= ~~(this.height * 1.25); alpha += this.gap) {
			// 	const angle = (Math.PI / ~~(this.height * 1.25)) * alpha;
			// 	points.push(this.createPoint(this.height - (Math.sin(angle) * this.height) / 2 + this.margin - this.height / 2, (Math.cos(angle) * this.height) / 2 + this.margin + this.height / 2));
			// }
			layer.points = points;
		}
	};

	const redraw = () => {
		button.initOrigins();
	};

	const buttons = document.getElementsByClassName("liquid-button");
	const button = [];

	for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
		button.push(buttons[buttonIndex]);

		button[buttonIndex].liquidButton = new LiquidButton(button[buttonIndex]);

		// button[buttonIndex].liquidButton.svg.addEventListener("mousemove", button[buttonIndex].liquidButton.mouseHandler);
		// button[buttonIndex].liquidButton.svg.addEventListener("mouseout", button[buttonIndex].liquidButton.clearHandler);
	}

	document.addEventListener("mousemove", function (e) {
		button.forEach((element) => {
			if (element.liquidButton.svg.getBoundingClientRect().top + pageYOffset - e.pageY < 100 && element.liquidButton.svg.getBoundingClientRect().top + pageYOffset - e.pageY > -(element.liquidButton.height + 100) && element.liquidButton.svg.getBoundingClientRect().left + pageXOffset - e.pageX < 100 && element.liquidButton.svg.getBoundingClientRect().left + pageXOffset - e.pageX > -(element.liquidButton.width + 100)) {
				element.liquidButton.mouseHandler(
					Math.abs(element.liquidButton.svg.getBoundingClientRect().left + pageXOffset - e.pageX) - 50,

					Math.abs(element.liquidButton.svg.getBoundingClientRect().top + pageYOffset - e.pageY) - 50
				);
			} else {
				element.liquidButton.clearHandler();
			}
		});
	});
});
