import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from './App';

jest.mock('./getWeb3', () => {
  return function getWeb3() {
    return {
      eth: {
        getAccounts: jest.fn(() => {
          return Promise.resolve(["0x0"]);
        }),
        net: {
          getId: jest.fn(() => {
            return new Promise((resolve) => {
              resolve(1);
            });
          })
        },
        Contract: jest.fn((a, b) => {
          return {
            methods: {
              getPhrase: jest.fn(() => {
                return {
                  call: jest.fn(() => {
                    return new Promise((resolve) => {
                      resolve("hello");
                    });
                  })
                };
              })
            }
          };
        })
      }
    }
  }
});

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders initial state of App with simple element checks", async () => {
  act(() => {
    render(<App doNotRunUpdateDAppToChainInterval />, container);
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  for (let i = 0; i < 10; i++) {
    await sleep(250);
    if (container.querySelector(".loading-screen")) {
      console.log("loading screen still visible", i);
      continue;
    }
    break;
  }

  const typographyElements = container.querySelectorAll(".MuiTypography-root");
  expect(typographyElements.length).toBe(5);
  expect(typographyElements[0].textContent).toBe("DApp One Word At A Time");
});
