type JsonStack = "{" | "[" | '"' | "'";

class JsonStream<T> {
  json: T = {} as T;
  buffer = "";
  cursor = 0;
  stack: JsonStack[] = [];

  lock?: Promise<void>;
  wakeup?: () => void;

  write(data: string) {
    this.buffer += data;
    this.wakeup?.();
  }

  async read() {
    for (;;) {
      if (this.cursor === 0) {
        this.buffer = this.buffer.replace(/^[\s\r\n]+/g, "");
      }
      while (this.cursor < this.buffer.length) {
        const stackTop = this.stack[this.stack.length - 1];
        const currentChar = this.buffer[this.cursor];

        if (stackTop === "'" || stackTop === '"') {
          if (currentChar === stackTop) {
            this.stack.pop();
          }
        } else {
          switch (currentChar) {
            case "}":
            case "]":
              if (stackTop.charCodeAt(0) === currentChar.charCodeAt(0) - 2) {
                this.stack.pop();
              }
              break;
            case "{":
            case "[":
            case "'":
            case '"':
              this.stack.push(currentChar);
          }
        }

        this.cursor++;

        if (this.stack.length === 0 && this.buffer.length !== 0) {
          const validJson = this.buffer.slice(0, this.cursor);

          this.buffer = this.buffer.slice(this.cursor);
          this.cursor = 0;

          console.log(validJson.length, validJson);
          return JSON.parse(validJson) as T;
        }
      }

      await this.nextSource;
    }
  }

  get nextSource() {
    if (!this.lock) {
      this.lock = new Promise<void>((resolve) => {
        this.wakeup = resolve;
      }).then(() => (this.lock = undefined));
    }

    return this.lock;
  }
}

export default JsonStream;
