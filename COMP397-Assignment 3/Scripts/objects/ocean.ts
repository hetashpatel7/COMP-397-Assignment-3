module objects {
    // Ocean Class ++++++++++++++++++++++++++++++++++++++
    export class Ocean extends createjs.Bitmap {
        // PUBLIC PROPERTIES ++++++++++++++++++++++++++++
        width: number;
        height: number;
        dx: number = 5;

        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++
        constructor(imageString: string) {
            super(imageString);
            this.width = this.getBounds().width;
            this.height = this.getBounds().height;

            this.reset();
        }

        // PRIVATE METHODS ++++++++++++++++++++++++++++++
        private checkBounds(): void {

            // check if ocean has left screen
            if(this.x+800==0)
            this.reset();
        }


        private reset(): void {
            this.y = 0;
            this.x =0; // reset ocean off screen
        }


        // PUBLIC METHODS +++++++++++++++++++++++++++++++
        public update(): void {

            this.x -= this.dx; // moves Ocean down the stage
            console.log("" + this.x);

            this.checkBounds();
        }
    }
}  