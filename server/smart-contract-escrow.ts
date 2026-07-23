
interface EscrowStatus {
  isPaused: boolean;
  pausedAt?: Date;
  pausedBy?: string;
}

class SmartContractEscrow {
  private status: EscrowStatus = { isPaused: false };

  pause(reason: string): void {
    this.status.isPaused = true;
    this.status.pausedAt = new Date();
    this.status.pausedBy = reason;
  }

  resume(): void {
    this.status.isPaused = false;
    this.status.pausedAt = undefined;
    this.status.pausedBy = undefined;
  }

  getStatus(): EscrowStatus {
    return { ...this.status };
  }

  isOperational(): boolean {
    return !this.status.isPaused;
  }
}

export const smartContractEscrow = new SmartContractEscrow();
