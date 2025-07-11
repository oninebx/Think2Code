const ProgressMessageWindow = (function () {

  const dom = {
    
  };

  function init() {
    dom.win = document.getElementById('progressMessageWindow');
    dom.text = document.getElementById('progressMessageText');
    dom.stream = document.getElementById('progressMessageStream');
    dom.content = document.getElementById('progressMessageContent');
    dom.bar = document.getElementById('progressBar');
    dom.closeBtn = document.getElementById('progressCloseBtn');
  }

  function trapKeys(e) {
    if (
      e.key === 'Tab' ||
      e.key === 'F5' ||
      (e.ctrlKey && e.key.toLowerCase() === 'r') ||
      (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight'))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  return {
    show(message) {
      dom.text.textContent = message || '';
      dom.stream.innerHTML = '';
      dom.bar.style.width = '0%';
      dom.content.style.display = 'none';
      dom.closeBtn.style.display = 'none';
      dom.win.style.display = 'flex';
      setTimeout(() => dom.win.classList.add('visible'), 10);
      document.body.classList.add('progress-message-active');
      document.addEventListener('keydown', trapKeys, true);
    },

    hide() {
      dom.win.classList.remove('visible');
      setTimeout(() => dom.win.style.display = 'none', 300);
      document.body.classList.remove('progress-message-active');
      document.removeEventListener('keydown', trapKeys, true);
      location.reload();
    },

    attachToForm(formId, initialMessage) {
      init();
      const form = document.getElementById(formId);
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        this.show(initialMessage || 'Uploading, please wait...');
        dom.stream.innerHTML = '';
        dom.bar.style.width = '0%';
        dom.content.style.display = 'none';
        dom.closeBtn.style.display = 'none';

        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });

        if (!response.body) {
          dom.stream.innerHTML = 'No streaming supported by this browser.';
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!value) continue;

          buffer += decoder.decode(value, { stream: true });
          let parts = buffer.split('\n');
          buffer = parts.pop();

          for (let part of parts) {
            if (!part.trim()) continue;
            try {
              const message = JSON.parse(part);
              if (message.Progress) {
                dom.bar.style.width = `${message.Progress}%`;
              }
              if (message.Line) {
                dom.content.style.display = 'block';
                dom.stream.innerHTML += `<span>${message.Line}</span><br>`;
                dom.stream.scrollTop = dom.stream.scrollHeight;
              }
              if (message.Error) {
                dom.content.style.display = 'block';
                dom.stream.innerHTML += `&emsp;<span style='color:#ff5252'>${message.Error}</span><br><br>`;
                dom.stream.scrollTop = dom.stream.scrollHeight;
              }
              if (message.Information) {
                dom.content.style.display = 'block';
                dom.stream.innerHTML += `<span style='color:#4caf50'>${message.Information}</span><br>`;
                dom.stream.scrollTop = dom.stream.scrollHeight;
              }
            } catch (err) {
              console.error('JSON parse error:', err, part);
            }
          }
        }

        dom.closeBtn.style.display = 'block';
      });
    }
  };
})();
