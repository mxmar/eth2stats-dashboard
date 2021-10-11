import { observable } from "mobx";
import {Store} from "app/store/Store";

export class Stats {
    @observable currentSlot: number;
    @observable currentEpoch: number;
    @observable secondsPerSlot: number;
    @observable timeSinceSlotStart = this.formatTime(0);

    main: Store;

    networkGenesisTime: number;
    interval: number;

    start(networkGenesisTime: string) {
        this.networkGenesisTime = Math.floor(
            new Date(networkGenesisTime).getTime() / 100) / 10;
        this.interval = setInterval(() => { this.calculateCurrentState(); }, 100);
        this.secondsPerSlot = this.main.getNetworkConfig()!.SECONDS_PER_SLOT;
    }

    stop() {
        clearInterval(this.interval);
        this.networkGenesisTime = 0;
        this.currentSlot = 0;
        this.currentEpoch = 0;
        this.timeSinceSlotStart = this.formatTime(0);
        this.secondsPerSlot = this.main.getNetworkConfig()!.SECONDS_PER_SLOT;
    }

    calculateCurrentState() {
        let now = Math.floor((new Date()).getTime() / 100) / 10;

        this.currentSlot = Math.floor((now - this.networkGenesisTime) / this.secondsPerSlot);
        this.currentEpoch = Math.floor(this.currentSlot / 32);
        this.timeSinceSlotStart = this.formatTime(Math.round(
            ((now - this.networkGenesisTime) - this.currentSlot * this.secondsPerSlot) * 10) / 10);
    }

    formatTime(t: any) {
        if (t < 0) { t = 0; }
        if (t > this.secondsPerSlot) { t = this.secondsPerSlot; }

        t += "";

        if (t.indexOf(".") === -1) {
            t += ".0";
        }

        t += "s";

        return t;
    }
}
