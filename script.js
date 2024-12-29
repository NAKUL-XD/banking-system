document.addEventListener("DOMContentLoaded", () => {
    // User Accounts Data
    const accounts = [
        {
            username: "Nakul",
            pin: "1234",
            balance: 160000,
            transactions: [
                { type: "Deposit", date: "Today", amount: 5000 },
                { type: "Withdrawal", date: "28/12/2024", amount: 300 },
                { type: "Deposit", date: "25/12/2024", amount: 8500 },
            ],
        },
        {
            username: "gabbar",
            pin: "5678",
            balance: 12500,
            transactions: [
                { type: "Deposit", date: "Today", amount: 3000 },
                { type: "Withdrawal", date: "27/12/2024", amount: 500 },
                { type: "Deposit", date: "24/12/2024", amount: 7500 },
            ],
        },
    ];

    // State Variables
    let currentAccount = null;

    // DOM Elements
    const loginButton = document.querySelector("header .login-box button");
    const loginInputs = document.querySelectorAll("header .login-box input");
    const balanceDisplay = document.querySelector(".dashboard .balance h2");
    const transferButton = document.querySelector(".card.transfer button");
    const transferInputs = document.querySelectorAll(".card.transfer input");
    const loanButton = document.querySelector(".card.loan button");
    const loanInput = document.querySelector(".card.loan input");
    const transactionTable = document.querySelector(".transaction-history tbody");
    const headerGreeting = document.querySelector("header h1");

    // Modal Elements
    const modal = document.getElementById("welcomeModal");
    const closeModalButton = modal.querySelector(".close");
    const gotItButton = modal.querySelector(".got-it-button");

    // Utility Functions
    const updateBalance = (amount) => {
        currentAccount.balance += amount;
        balanceDisplay.textContent = `₹${currentAccount.balance.toFixed(2)}`;
    };

    const addTransaction = (type, amount) => {
        const date = new Date().toLocaleDateString();
        currentAccount.transactions.push({ type, date, amount });
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${type}</td>
          <td>${date}</td>
          <td>₹${amount.toFixed(2)}</td>
        `;
        transactionTable.prepend(row);
    };

    const initializeTransactions = () => {
        transactionTable.innerHTML = ""; // Clear previous transactions
        currentAccount.transactions.forEach(({ type, date, amount }) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${type}</td>
            <td>${date}</td>
            <td>₹${amount.toFixed(2)}</td>
          `;
            transactionTable.appendChild(row);
        });
    };

    // Event Listener for Login Button
    loginButton.addEventListener("click", () => {
        const user = loginInputs[0].value.trim();
        const pin = loginInputs[1].value.trim();

        const account = accounts.find(
            (acc) => acc.username === user && acc.pin === pin
        );

        if (account) {
            currentAccount = account;
            headerGreeting.textContent = `Good Afternoon, ${currentAccount.username}!`;
            updateBalance(0); // Display current balance
            initializeTransactions(); // Display transaction history
            loginInputs[0].value = "";
            loginInputs[1].value = "";

            // Display modal welcome message
            const userNameSpan = document.getElementById("user-name");
            userNameSpan.textContent = currentAccount.username;
            modal.style.display = "block";
        } else {
            alert("Invalid username or PIN.");
        }
    });

    // Close Modal when "Got it!" button is clicked
    gotItButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close Modal when the close button (x) is clicked
    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close Modal if clicked outside of modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Transfer Money
    transferButton.addEventListener("click", () => {
        if (!currentAccount) {
            alert("Please log in first.");
            return;
        }

        const recipient = transferInputs[0].value.trim();
        const amount = parseFloat(transferInputs[1].value);

        const recipientAccount = accounts.find(
            (acc) => acc.username === recipient && acc !== currentAccount
        );

        if (!recipient || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid recipient and amount.");
            return;
        }

        if (!recipientAccount) {
            alert("Recipient not found.");
            return;
        }

        if (amount > currentAccount.balance) {
            alert("Insufficient balance!");
            return;
        }

        // Update balances and transactions
        updateBalance(-amount);
        addTransaction("Transfer", -amount);

        recipientAccount.balance += amount;
        recipientAccount.transactions.push({
            type: "Received",
            date: new Date().toLocaleDateString(),
            amount,
        });

        alert(`Successfully transferred ₹${amount.toFixed(2)} to ${recipient}.`);
        transferInputs[0].value = "";
        transferInputs[1].value = "";
    });

    // Request Loan
    loanButton.addEventListener("click", () => {
        if (!currentAccount) {
            alert("Please log in first.");
            return;
        }

        const amount = parseFloat(loanInput.value);

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid loan amount.");
            return;
        }

        updateBalance(amount);
        addTransaction("Loan", amount);
        alert(`Loan of ₹${amount.toFixed(2)} approved!`);
        loanInput.value = "";
    });
});
