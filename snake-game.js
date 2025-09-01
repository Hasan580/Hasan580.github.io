// Classic Snake Game with Modern Styling
class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = 20;
        
        this.canvas.width = this.gridSize * this.tileCount;
        this.canvas.height = this.gridSize * this.tileCount;
        
        this.snake = [
            {x: 10, y: 10}
        ];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gameOver = false;
        
        this.setupEventListeners();
        this.generateFood();
        this.draw();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning && !this.gameOver) {
                this.startGame();
            }
            
            // Prevent snake from going in reverse
            if (e.key === 'ArrowUp' && this.dy !== 1) {
                this.dx = 0;
                this.dy = -1;
            } else if (e.key === 'ArrowDown' && this.dy !== -1) {
                this.dx = 0;
                this.dy = 1;
            } else if (e.key === 'ArrowLeft' && this.dx !== 1) {
                this.dx = -1;
                this.dy = 0;
            } else if (e.key === 'ArrowRight' && this.dx !== -1) {
                this.dx = 1;
                this.dy = 0;
            } else if (e.key === ' ' && this.gameOver) {
                this.resetGame();
            }
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameLoop();
    }
    
    resetGame() {
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gameOver = false;
        this.generateFood();
        this.draw();
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        // Make sure food doesn't spawn on snake
        for (let segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood();
                return;
            }
        }
    }
    
    update() {
        if (!this.gameRunning) return;
        
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.endGame();
            return;
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.endGame();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
    }
    
    draw() {
        // Clear canvas with dark background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#00ff00';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00ff00';
            } else {
                // Body
                this.ctx.fillStyle = '#008800';
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = '#008800';
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 2,
                segment.y * this.gridSize + 2,
                this.gridSize - 4,
                this.gridSize - 4
            );
        });
        
        // Draw food
        this.ctx.fillStyle = '#ff0000';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff0000';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Draw score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Space Grotesk, monospace';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        
        // Draw game state messages
        if (!this.gameRunning && !this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px Space Grotesk, monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press any arrow key to start', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '16px Space Grotesk, monospace';
            this.ctx.fillText('Use arrow keys to control the snake', this.canvas.width / 2, this.canvas.height / 2 + 30);
        } else if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '32px Space Grotesk, monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Space Grotesk, monospace';
            this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
            this.ctx.font = '16px Space Grotesk, monospace';
            this.ctx.fillText('Press SPACE to play again', this.canvas.width / 2, this.canvas.height / 2 + 50);
        }
        
        this.ctx.textAlign = 'left';
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.draw();
            setTimeout(() => this.gameLoop(), 150);
        }
    }
}