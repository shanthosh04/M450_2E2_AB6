const hh = require("hyperscript-helpers");
const { h, diff, patch } = require("virtual-dom");
const createElement = require("virtual-dom/create-element");

const { div, button, p, input, br } = hh(h);

const ButtonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded";

const MESSAGES = {
  QUESTION_QUIZ: "QUESTION_QUIZ",
  ANSWER_QUIZ: "ANSWER_QUIZ",
  ADD_QUIZ: "ADD_QUIZ",
  SHOW_HIDE_ANSWER: "SHOW_HIDE_ANSWER",
  DELETE_QUIZ: "DELETE_QUIZ",
  EDIT_QUIZ: "EDIT_QUIZ",
  FEEDBACK_QUIZ: "FEEDBACK_QUIZ",
};

function view(dispatch, model) {
  return div({}, [
    div({}, [
      input({
        type: "text",
        placeholder: "Give your Question",
        value: model.question,
        oninput: (event) =>
          dispatch({ type: MESSAGES.QUESTION_QUIZ, value: event.target.value }),
        className: "border border-blue-300 rounded p-1 mr-2",
      }),
      input({
        type: "text",
        placeholder: "Give your answer",
        value: model.answer,
        oninput: (event) =>
          dispatch({ type: MESSAGES.ANSWER_QUIZ, value: event.target.value }),
        className: "border border-blue-300 rounded p-1 mr-2",
      }),
      button(
        {
          onclick: () => dispatch({ type: MESSAGES.ADD_QUIZ }),
          className: ButtonStyle,
        },
        "Save"
      ),
    ]),
    model.cards.map((card, index) =>
      div(
        { className: "bg-teal-700 w-60 break-words relative m-10 p-10 " },
        [
          p(
            { className: "absolute top-5 right-5" },
            [
              button(
                {
                  onclick: () => dispatch({ type: MESSAGES.EDIT_QUIZ, index }),
                },
                "Edit"
              ),

              button(
                {
                  onclick: () => dispatch({ type: MESSAGES.DELETE_QUIZ, index }),
                },
                "X"
              ),
            ]
          ),
          p({}, "Frage"),
          p({}, card.question),
          br({}),
          button(
            {
              onclick: () => dispatch({ type: MESSAGES.SHOW_HIDE_ANSWER, index }),
            },
            card.showAnswer ? "Hide" : "Show"
          ),
          card.showAnswer ? p({}, card.answer) : null,
          card.showAnswer ? br({}) : null,
          div({}, [
            "Evaluation: ",
            br({}),
            button(
              {
                onclick: () =>
                  dispatch({ type: MESSAGES.FEEDBACK_QUIZ, index, feedback: "Bad" }),
              },
              "Bad"
            ),
            button(
              {
                onclick: () =>
                  dispatch({ type: MESSAGES.FEEDBACK_QUIZ, index, feedback: "Good" }),
              },
              "Good"
            ),
            button(
              {
                onclick: () =>
                  dispatch({ type: MESSAGES.FEEDBACK_QUIZ, index, feedback: "Perfect" }), 
              },
              "Perfect"
            ),
          ]),
        ]
      )
    ),
  ]);
}

function update(message, model) {
  switch (message.type) {
    case MESSAGES.QUESTION_QUIZ:
      return { ...model, question: message.value };
    case MESSAGES.ANSWER_QUIZ:
      return { ...model, answer: message.value };
    case MESSAGES.ADD_QUIZ:
      return {
        ...model,
        cards: [
          ...model.cards,
          { question: model.question, answer: model.answer, showAnswer: false },
        ],
        question: "",
        answer: "",
      };
    case MESSAGES.SHOW_HIDE_ANSWER:
      const updatedCards = [...model.cards];
      updatedCards[message.index].showAnswer = !updatedCards[message.index]
        .showAnswer;
      return { ...model, cards: updatedCards };
    case MESSAGES.DELETE_QUIZ:
      return {
        ...model,
        cards: model.cards.filter((_, index) => index !== message.index),
      };
    case MESSAGES.EDIT_QUIZ:
      const cardToEdit = model.cards[message.index];
      return {
        ...model,
        question: cardToEdit.question,
        answer: cardToEdit.answer,
        cards: model.cards.filter((_, index) => index !== message.index),
      };
    case MESSAGES.FEEDBACK_QUIZ:
      const feedback = message.feedback;
      const index = message.index;
      if (feedback === "Bad") {
        updatedCards[index].ranking = (updatedCards[index].ranking || 0) - 0;
      } else if (feedback === "Good") {
        updatedCards[index].ranking = (updatedCards[index].ranking || 0) + 1;
      } else if (feedback === "Perfect") {
        updatedCards[index].ranking = (updatedCards[index].ranking || 0) + 2;
      }
      return { ...model, cards: updatedCards };
    default:
      return model;
  }
}

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const initModel = {
  question: "",
  answer: "",
  cards: [],
};

const rootNode = document.getElementById("app");

app(initModel, update, view, rootNode);

module.exports = { view, update, app, initModel };
