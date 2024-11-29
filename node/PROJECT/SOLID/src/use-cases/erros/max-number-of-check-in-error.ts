export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super("Max number check in reached.");
  }
}
