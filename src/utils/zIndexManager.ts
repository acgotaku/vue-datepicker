class ZIndexManager {
  zIndex = 1000;

  increase() {
    this.zIndex++;
    return this.zIndex;
  }
}

export default new ZIndexManager();
