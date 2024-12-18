// ==UserScript==
// @name         Edge-nuity Megascript
// @version      1.2
// @description  Completes through instructional, summary, and warm-up sections by guessing answers (they don’t impact grades). You can begin activities while the instructor is speaking, when theres an activity, a "Search clipboard" button appears for quick access to answers during quizzes (will search your copied text on brainly and auto-redirect) And much more (read desc).
// @author       TTT
// @license MIT
// @include *://*core.learn*/*
// @include https://brainly.com/*
// @grant        none
// @namespace https://www.tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/515137/Edge-nuity%20Megascript.user.js
// @updateURL https://update.greasyfork.org/scripts/515137/Edge-nuity%20Megascript.meta.js
// ==/UserScript==
const checkElementVisibility = (element) => {
    const boundingRect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    return (
        computedStyle.opacity !== '0' &&
        computedStyle.visibility !== 'hidden' &&
        computedStyle.display !== 'none' &&
        boundingRect.width > 0 &&
        boundingRect.height > 0
    );
};

const checkForTimerStayElement = () => {
    const targetElement = document.getElementById('timerStay');

    if (targetElement && checkElementVisibility(targetElement)) {
        const simulatedClickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        targetElement.dispatchEvent(simulatedClickEvent);
    }
};

const intervalId = setInterval(checkForTimerStayElement, 100);

let videoElement = null;
let alertTriggered = false;
let alertScheduled = false;

const callback = function(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      videoElement = document.getElementById("home_video_js");
      if (videoElement) {
        startCheckingVideo();

        observer.disconnect();
      }
    }
  }
};

const config = {
  attributes: false,
  childList: true,
  subtree: true
};

const targetNode = document.body;
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

function startCheckingVideo() {
  setInterval(() => {
    if (videoElement) {
      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration;

      if (currentTime >= duration) {
        if (!alertScheduled) {
          alertScheduled = true;
          let checksCount = 0;
          let allChecksPassed = true;

          const intervalId = setInterval(() => {
            const homeVideoContainer = document.getElementById("home_video_container");
            if (homeVideoContainer && homeVideoContainer.parentNode.style.opacity == 1) {
              checksCount++;
            } else {
              allChecksPassed = false;
            }

            if (checksCount === 10) {
              clearInterval(intervalId);
              if (allChecksPassed) {
                new Notification("Reload!");
                alertTriggered = true;
              }
              alertScheduled = false;
            }
          }, 100);
        }
      } else {
        alertTriggered = false;
      }
    }
  }, 550);
}


(function() {
    'use strict';

    let completeCount = 0;

    const originalConsoleLog = console.log;
    console.log = function() {
        const message = Array.from(arguments).join(' ');
        if (message.includes('complete')) {
            completeCount++;
            if (completeCount === 2) {
                const goRightButton = document.querySelector('li.FrameRight a');
                if (goRightButton) {
                    goRightButton.click();
                    completeCount = 0;
                }
            }
        }
        originalConsoleLog.apply(console, arguments);
    };
})();
function checkAutoplay() {
    const isAutoplayChecked = document.getElementById('autoplayCheckbox').checked;
    if (isAutoplayChecked) {
        playVideo();
    }
}

setInterval(checkAutoplay, 1000);
function playVideo() {
    var playButton = window.frames[0].document.getElementById("uid1_play");
    if (playButton != undefined) {
        setTimeout(function() {
            if (playButton.className == "play") {
                playButton.children[0].click();
            }
        }, 1000);
    }
}

    function showColumn() {
        try {
            window.frames[0].frames[0].document.getElementsByClassName("right-column")[0].children[0].style.display = "block";
        } catch (TypeError) {}

        try {
            window.frames[0].frames[0].document.getElementsByClassName("left-column")[0].children[0].style.display = "block";
        } catch (TypeError) {}
    }

    setInterval(showColumn, 1000);

function clearLocalStorage() {
    try {
        localStorage.clear();
    } catch (error) {}
}

function removeElementsByClassName(className) {
    var elements = document.getElementsByClassName(className);
    Array.prototype.forEach.call(elements, function(element) {
        try {
            element.parentNode.removeChild(element);
        } catch (error) {}
    });
}

function handleOnload() {
    var classNamesToRemove = [
        "brn-expanded-bottom-banner",
        "brn-brainly-plus-box",
        "brn-fullscreen-toplayer",
        "sg-overlay sg-overlay--dark"
    ];
    classNamesToRemove.forEach(function(className) {
        removeElementsByClassName(className);
    });
}

if ( __get$(__get$(window,"location"),"href") .includes("brainly.com")) {
    clearLocalStorage();
    handleOnload();
}

function redirectToFirstSearchItem() {
    if ( __get$(__get$(window,"location"),"href") .startsWith('https://brainly.com/app/ask')) {
        const searchItem = document.querySelector('[data-testid="search-item-facade-wrapper"]');
        if (searchItem) {
            const anchorElement = searchItem.querySelector('a');
            if (anchorElement) {
                const href = anchorElement.getAttribute('href');
                const fullUrl = `https://brainly.com${href}`;
                 __set$(__get$(window,"location"),"href",fullUrl) ;
                clearInterval(interval);
            }
        }
    }
}

const interval = setInterval(redirectToFirstSearchItem, 1000);


function checkElement() {
    const element = document.querySelector('[data-testid="answer_box"][data-test="locked_answer"]');

    if (element &&  __get$(__get$(document,"location"),"href") .includes("brainly.com/question")) {
         __get$Loc(location) .reload();
    }
}
setInterval(checkElement, 750);



let buttonsClicked = false;

function updateTextareaAndClickButtonsOnce() {
    try {
        const iframeDoc = window.frames[0].frames[0].document;

        if (iframeDoc.readyState === 'complete') {
            const textarea = iframeDoc.querySelector('.QuestionTextArea');

            if (textarea && textarea.value.trim() === '') {
                const answerChoices = iframeDoc.querySelectorAll('.answer-choice-label');

                let allText = '';

                answerChoices.forEach(choice => {
                    allText += choice.textContent.trim() + '\n';
                });

                textarea.value = allText.trim();

                const buttons = iframeDoc.querySelectorAll('.answer-choice-button');

                buttons.forEach(button => {
                    if (button) {
                        button.click();
                    } else {
                        console.warn("Button with class 'answer-choice-button' not found.");
                    }
                });

                const doneButtons = iframeDoc.querySelectorAll('.done-start');
                setTimeout(() => {
                    doneButtons.forEach(doneButton => {
                        if (doneButton) {
                            doneButton.click();
                        } else {
                            console.warn("Button with class 'done-start' not found.");
                        }
                    });

                    const retryButtons = iframeDoc.querySelectorAll('.done-retry');
                    setTimeout(() => {
                        retryButtons.forEach(retryButton => {
                            if (retryButton) {
                                retryButton.click();
                            } else {
                                console.warn("Button with class 'done-retry' not found.");
                            }
                        });
                    },400);
                }, 200);
            }
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
function checkUpdateTextareaAndClickButtonsOnce() {
    const isAutoWritingChecked = document.getElementById('autoWritingCheckbox').checked;
    const element = document.getElementById('activity-title');

    const isAssignmentTitle = element && element.textContent.includes("Assignment");

    const isAutoWritingOnAssignmentChecked = isAssignmentTitle
        ? document.getElementById('autoWritingOnAssignmentCheckbox').checked
        : true; 

    if (isAutoWritingChecked && (isAssignmentTitle ? isAutoWritingOnAssignmentChecked : true)) {
        updateTextareaAndClickButtonsOnce();
    }
}

setInterval(checkUpdateTextareaAndClickButtonsOnce, 1000);


function checkOpacity() {
    if (frames[0] && frames[0].document) {
        var homeVideoContainer = frames[0].document.getElementById("home_video_container");
        if (homeVideoContainer && homeVideoContainer.parentNode.style.opacity == 1) {
        } else {
            try {
                if (document.getElementById("activity-title").innerText == "Assignment") {}
                if (["Instruction", "Summary", "Warm-Up"].includes(document.getElementById("activity-title").innerText)) {
                    try {
                        clickFootnavAndNextFrame();
                        window.options = window.frames[0].frames[0].document.getElementsByClassName("answer-choice-button");
                         __get$(window.options,Math.floor(Math.random()*window.options.length)) .click();
                    } catch (TypeError) {}
                    try {
                        window.frames[0].API.Frame.check();
                    } catch (TypeError) {}
                }
            } catch (TypeError) {}
        }
    }
}

function checkcheckOpacity() {
    const isGuessingChecked = document.getElementById('guessingCheckbox').checked;
    if (isGuessingChecked) {
        checkOpacity();
    }
}

setInterval(checkcheckOpacity, 1000);


setInterval(function() {

document.getElementById("invis-o-div").remove();
}, 1000);


function clickFootnavAndNextFrame() {
    try {
        document.getElementsByClassName("footnav goRight")[0].click();
    } catch (TypeError) {}

    try {
        window.frames[0].API.FrameChain.nextFrame();
    } catch (TypeError) {}
}

setInterval(function() {
    try {
        window.frames[0].document.getElementById("invis-o-div").remove();
    } catch (TypeError) {}
}, 1000);



var clipboardButton;

function createClipboardSearchButton() {
    try {
        var iframe = document.querySelector("iframe");
        if (iframe) {
            var rect = iframe.getBoundingClientRect();
            var iframeTop = rect.top + window.scrollY;
            var iframeRight = rect.right + window.scrollX;

            var buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'fixed';
            buttonContainer.style.top = (iframeTop + 10) + 'px';
            buttonContainer.style.left = (iframeRight - 150) + 'px';
            buttonContainer.style.zIndex = '9999';
            document.body.appendChild(buttonContainer);

            clipboardButton = document.createElement('button');
            clipboardButton.innerText = 'Search Clipboard';
            buttonContainer.appendChild(clipboardButton);

            clipboardButton.onclick = function(event) {
                event.stopPropagation();
                navigator.clipboard.readText().then(function(clipboardText) {
                    if (clipboardText) {
                        const isBrainlyChecked = document.getElementById('searchInBrainlyCheckbox').checked;
                        var searchUrl = 'https://brainly.com/app/ask?entry=top&q=' + encodeURIComponent(clipboardText);

                        if (isBrainlyChecked) {
                            var brainlyIframe = document.getElementById('brainly-chat-iframe');
                            if (brainlyIframe) {
                                brainlyIframe.src = searchUrl;
                            } else {
                                console.error('Brainly iframe not found.');
                            }
                        } else {
                            window.open(searchUrl, '_blank');
                        }
                    }
                }).catch(function(err) {
                    console.error('Could not read clipboard text: ', err);
                });
            };
        }
    } catch (error) {
        console.error('Error accessing the first iframe:', error);
    }
}

function checkClipboardSearchButton() {
    const isClipboardChecked = document.getElementById('searchClipboardCheckbox').checked;

    if (isClipboardChecked) {
        if (!clipboardButton) {
            createClipboardSearchButton();
        }
    } else {
        if (clipboardButton) {
            clipboardButton.parentElement.removeChild(clipboardButton);
            clipboardButton = null;
        }
    }
}

setInterval(checkClipboardSearchButton, 1000);

function addDeepaiIframes() {
    const wrapElement = document.getElementById('wrap');

    if (!document.getElementById('deepai-chat-iframe')) {
        const deepaiIframe = document.createElement('iframe');
        deepaiIframe.id = 'deepai-chat-iframe';
        deepaiIframe.src = 'https://deepai.org/chat';

        deepaiIframe.style.width = '25%';
        deepaiIframe.style.height = '100vh';
        deepaiIframe.style.border = 'none';
        deepaiIframe.style.position = 'absolute';
        deepaiIframe.style.top = '0';
        deepaiIframe.style.right = '0';
        deepaiIframe.style.zIndex = '20000';
        wrapElement.style.position = 'relative';
        deepaiIframe.style.opacity = '0';
        deepaiIframe.style.transition = 'opacity 0.5s';
        deepaiIframe.sandbox = 'allow-same-origin allow-scripts';

        document.body.appendChild(deepaiIframe);
    }
}

function addBrainlyIframes() {
    const wrapElement = document.getElementById('wrap');

    if (!document.getElementById('brainly-chat-iframe')) {
        const brainlyIframe = document.createElement('iframe');
        brainlyIframe.id = 'brainly-chat-iframe';
        brainlyIframe.src = 'https://brainly.com/search';

        brainlyIframe.style.width = '25%';
        brainlyIframe.style.height = '100vh';
        brainlyIframe.style.border = 'none';
        brainlyIframe.style.position = 'absolute';
        brainlyIframe.style.top = '0';
        brainlyIframe.style.left = '0';
        brainlyIframe.style.zIndex = '20000';
        wrapElement.style.position = 'relative';
        brainlyIframe.style.opacity = '0';
        brainlyIframe.style.transition = 'opacity 0.5s';
        brainlyIframe.sandbox = 'allow-same-origin allow-scripts';

        document.body.appendChild(brainlyIframe);
    }
}

addDeepaiIframes();
addBrainlyIframes();

function updateDeepaiIframeVisibility() {
    const deepaiIframe = document.getElementById('deepai-chat-iframe');
    const isAiChatChecked = document.getElementById('aiChatCheckbox').checked;

    if (deepaiIframe) {
        if (isAiChatChecked) {
            deepaiIframe.style.opacity = '1';
            deepaiIframe.style.display = 'block';
        } else {
            deepaiIframe.style.opacity = '0';
            setTimeout(() => deepaiIframe.style.display = 'none', 500);
        }
    }
}

function updateBrainlyIframeVisibility() {
    const brainlyIframe = document.getElementById('brainly-chat-iframe');
    const isBrainlyChecked = document.getElementById('searchInBrainlyCheckbox').checked;

    if (brainlyIframe) {
        if (isBrainlyChecked) {
            brainlyIframe.style.opacity = '1';
            brainlyIframe.style.display = 'block';
        } else {
            brainlyIframe.style.opacity = '0';
            setTimeout(() => brainlyIframe.style.display = 'none', 500);
        }
    }
}

setInterval(() => {
    updateDeepaiIframeVisibility();
    updateBrainlyIframeVisibility();
}, 1000);

function createButtonAndPane() {
    if (document.querySelector('#tweaksButton')) return;

    const mainFootDiv = document.querySelector('.mainfoot');

    const toggleButton = document.createElement('button');
    toggleButton.id = 'tweaksButton';
    toggleButton.textContent = 'Toggle Options';

    toggleButton.style.border = "1px solid #5f5f5f";
    toggleButton.style.boxShadow = "inset 0 0 5px rgba(0, 0, 0, 0.6)";
    toggleButton.style.backgroundColor = "rgb(39, 39, 39)";
    toggleButton.style.color = "#f9a619";
    toggleButton.style.borderRadius = "3px";
    toggleButton.style.marginLeft = "40%";
    toggleButton.style.zIndex = "2";
    toggleButton.style.padding = '5px 10px';

    mainFootDiv.appendChild(toggleButton);

    if (!window.pane) {
        window.pane = document.createElement('div');
        window.pane.style.display = 'none';
        document.body.appendChild(window.pane);

        const popupMenu = document.createElement('div');
        popupMenu.className = 'popup-menu';

        const aiChatItem = createMenuItem('AI Chat', 'aiChatCheckbox');
        popupMenu.appendChild(aiChatItem);

        const searchInBrainlyItem = createMenuItem('Search in Brainly frame', 'searchInBrainlyCheckbox');
        popupMenu.appendChild(searchInBrainlyItem);

        const autoVocabItem = createMenuItem('Auto Vocab', 'autoVocabCheckbox');
        popupMenu.appendChild(autoVocabItem);

        const autoWritingItem = createMenuItem('Auto Writing', 'autoWritingCheckbox');
        popupMenu.appendChild(autoWritingItem);

        const autoplayItem = createMenuItem('Autoplay', 'autoplayCheckbox');
        popupMenu.appendChild(autoplayItem);

        const searchClipboardItem = createMenuItem('Search Clipboard Button', 'searchClipboardCheckbox');
        popupMenu.appendChild(searchClipboardItem);

        const guessingItem = createMenuItem('Guessing', 'guessingCheckbox');
        popupMenu.appendChild(guessingItem);

        const autoWritingOnAssignmentItem = createMenuItem('AutoWriting On Assignment', 'autoWritingOnAssignmentCheckbox');
        popupMenu.appendChild(autoWritingOnAssignmentItem);

        window.pane.appendChild(popupMenu);

const footerText = document.createElement('div');
footerText.style.marginTop = '20px';
footerText.style.color = 'rgb(249, 166, 25)';
footerText.style.textAlign = "center";
footerText.textContent = "This was made by me, TallTacoTristan, as a way to make edge-nuity " +
    "classes MUCH easier and skip by the tedious bits but it took a long time, probably over " +
    "24 hours of just coding, to write over half a thousand lines, it has many features, " +
    "the ones above are less than half, just the ones that need a toggle. " +
    "So please leave a good review on my page for all the time I spent to save yours, Thank you.";

const discordMessage = document.createElement('div');
discordMessage.textContent = "Join this discord if you have any issues, questions, or suggestions!.";
discordMessage.style.marginTop = '10px';

const discordLink = document.createElement('a');
discordLink.textContent = "https://discord.gg/2FyCYXfN";
 __set$(discordLink,"href","https://discord.gg/2FyCYXfN") ;
discordLink.target = "_blank";
discordLink.style.marginTop = '5px';
discordLink.style.color = 'cyan';
discordLink.style.textDecoration = 'underline';

footerText.appendChild(discordMessage);
footerText.appendChild(discordLink);

window.pane.appendChild(footerText);


        loadCheckboxState('aiChat', 'aiChatCheckbox');
        loadCheckboxState('searchInBrainly', 'searchInBrainlyCheckbox');
        loadCheckboxState('autoVocab', 'autoVocabCheckbox');
        loadCheckboxState('autoWriting', 'autoWritingCheckbox');
        loadCheckboxState('autoplay', 'autoplayCheckbox');
        loadCheckboxState('searchClipboard', 'searchClipboardCheckbox');
        loadCheckboxState('guessing', 'guessingCheckbox');
        loadCheckboxState('autoWritingOnAssignment', 'autoWritingOnAssignmentCheckbox');

        makeDraggable(window.pane);
    }

    toggleButton.addEventListener('click', function() {
        console.log('Button clicked! Toggling pane visibility.');

        if (window.pane.style.display === 'none' || window.pane.style.display === '') {
            window.pane.style.width = "50%";
            window.pane.style.height = "auto";
            window.pane.style.position = "absolute";
            window.pane.style.marginTop = "20vh";
            window.pane.style.marginLeft = "25%";
            window.pane.style.border = "1px solid rgb(95, 95, 95)";
            window.pane.style.borderRadius = "3px";
            window.pane.style.backgroundColor = "rgb(39, 39, 39)";
            window.pane.style.overflow = "hidden";
            window.pane.style.color = "rgb(249, 166, 25)";
            window.pane.style.textAlign = "center";
            window.pane.style.overflowY = "scroll";
            window.pane.style.display = 'block';

            checkCheckboxState('aiChatCheckbox');
            checkCheckboxState('searchInBrainlyCheckbox');
            checkCheckboxState('autoVocabCheckbox');
            checkCheckboxState('autoWritingCheckbox');
            checkCheckboxState('autoplayCheckbox');
            checkCheckboxState('searchClipboardCheckbox');
            checkCheckboxState('guessingCheckbox');
            checkCheckboxState('autoWritingOnAssignmentCheckbox');
        } else {
            window.pane.style.display = 'none';
        }
    });
}
function makeDraggable(element) {
    let offsetX, offsetY;

    element.addEventListener('mousedown', function(e) {
        e.preventDefault();
        offsetX = e.clientX - element.getBoundingClientRect().left + element.offsetWidth / 2; 
        offsetY = e.clientY - element.getBoundingClientRect().top + element.offsetHeight / 2; 
        element.classList.add('dragging');

        document.addEventListener('mousemove', dragElement);
        document.addEventListener('mouseup', stopDragging);
    });

    function dragElement(e) {
        e.preventDefault();
        let x = e.clientX - offsetX; 
        let y = e.clientY - offsetY; 

        element.style.left = x + 'px';
        element.style.top = y + 'px';
    }

    function stopDragging() {
        element.classList.remove('dragging');
        document.removeEventListener('mousemove', dragElement);
        document.removeEventListener('mouseup', stopDragging);
    }
}
function createMenuItem(text, checkboxId) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;

    const storedValue = localStorage.getItem(checkboxId);
    if (storedValue !== null) {
        checkbox.checked = (storedValue === 'true');
    }

    const label = document.createElement('label');
    label.innerText = text;
    label.setAttribute('for', checkboxId);

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);

    checkbox.addEventListener('change', () => {
        console.log(`${text} checkbox is now ${checkbox.checked ? 'checked' : 'unchecked'}`);
        localStorage.setItem(checkboxId, checkbox.checked);
    });

    return itemDiv;
}

function loadCheckboxState(checkboxId) {
    const storedValue = localStorage.getItem(checkboxId);
    if (storedValue !== null) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = (storedValue === 'true');
        }
    }
}

function checkCheckboxState(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    const storedValue = localStorage.getItem(checkboxId);

    if (storedValue !== null && checkbox) {
        if (checkbox.checked !== (storedValue === 'true')) {
            checkbox.checked = (storedValue === 'true');
        }
    }
}

setInterval(createButtonAndPane, 1000);


var checkbox = document.getElementById('searchInBrainlyCheckbox');





let lastTitle = '';

function checkForAssignment() {
    const element = document.getElementById('activity-title');
    if (element) {
        const currentTitle = element.textContent || element.innerText;

        const excludedKeywords = [
            "Summary", "Warm-Up", "Instruction", "Quiz",
            "Assignment", "Unit Test",
            "Unit Review", "Cumulative Exam Review",
            "Vocab","Cumulative Exam"
        ];

        const containsExcludedKeyword = excludedKeywords.some(keyword => currentTitle.includes(keyword));
        const currentContainsAssignment = currentTitle.includes("Assignment");

        if (currentTitle !== lastTitle) {
            if (currentContainsAssignment || !containsExcludedKeyword) {
                new Notification("Done!");
            }
            lastTitle = currentTitle;
        }
    }
}
setInterval(checkForAssignment, 1000);
const isAutoVocabChecked = document.getElementById('autoVocabCheckbox').checked;


function clickNextButtonIfVocabulary() {
    if (document.getElementById("activity-title").innerText === "Vocabulary") {
        const nextButton = window.frames[0].document.getElementsByClassName("uibtn uibtn-blue uibtn-arrow-next")[0];
        if (nextButton) {
            nextButton.click();
            console.log("Clicked next button");
        } else {
            console.log("Next button not found");
        }
    }
}

function vocabCompleter() {
    if (document.getElementById("activity-title").innerText === "Vocabulary") {
        var i = 0;
        try {
            var txt = window.frames[0].document.getElementsByClassName("word-background")[0].value;
            window.frames[0].document.getElementsByClassName("word-textbox")[0].value = txt;
            var event = new Event("keyup");
            window.frames[0].document.getElementsByClassName("word-textbox word-normal")[0].dispatchEvent(event);
        } catch (e) {
            console.error(e); 
            return;
        }

        var speed = 50;
        var output = "Vocab Completer, ";
        
        window.frames[0].document.getElementsByClassName("playbutton vocab-play")[0].click();
        window.frames[0].document.getElementsByClassName("playbutton vocab-play")[1].click();
        
    }
}

function checkAndExecuteFunctions() {
    const isAutoVocabChecked = document.getElementById('autoVocabCheckbox').checked;
    if (isAutoVocabChecked) {
        clickNextButtonIfVocabulary();
        vocabCompleter();
    }
}

setInterval(checkAndExecuteFunctions, 1000);


setInterval(() => {
    const activityTitle = document.getElementById("activity-title").innerText;
    const homeVideoContainer = document.querySelector('.home-video-container');
    const shouldClick = !(
        homeVideoContainer &&
        homeVideoContainer.parentNode.style.opacity == "1"
    );

    if (shouldClick && !["Assignment", "Quiz"].includes(activityTitle)) {
        const goRightButton = document.querySelector(".FrameRight");
        if (goRightButton) {
            goRightButton.onclick();
        }
        const iconButton = document.querySelector(".nav-icon[data-bind='realEnable: $root.stageView().nextEnabled']");
        if (iconButton) {
            iconButton.click();
        }
    }
}, 1000);
