import {
  onExit,
  onPrint,
  onInput,
  setGameOptions,
  getGameState,
  gameMain,
} from "./superstartrek.mjs";

var term = new Terminal({
  fontSize: 14,
});
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.querySelector(".terminal"));
fitAddon.fit();
term.focus();

function print(...messages) {
  term.write(messages.join("").replace(/\n/g, "\r\n") + "\r\n");
}

function input(prompt) {
  return new Promise((resolve) => {
    let str = "";
    term.write(`${prompt}? `);
    const initialX = term._core.buffer.x;
    const disposeOnData = term.onData((data) => {
      if (data == "\n" || data == "\r") {
        term.write("\r\n");
        disposeOnData.dispose();
        resolve(str);
      } else if (/^[a-zA-Z0-9,\.]+$/.test(data)) {
        str += data;
        term.write(data);
      } else if (data == "\u007F" && str.length > 0) {
        str = str.slice(0, -1);
        term.write("\b \b");
      }
    });
  });
}

async function exit() {
  print();
  await input("GAME EXITED, PRESS ENTER TO RESTART");
  window.location.reload();
}

onPrint(print);
onInput(input);
onExit(exit);

gameMain().then().catch(window.alert);
