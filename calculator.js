var input = {
  market : 4,
  capital : 10,
  options : [{
    amount : 5,
    price : 1
  }, {
    amount : 5,
    price : 2
  }]
};
input.options.sort(compareOptions);

var state = {
  amount : 0,
  capital : input.capital,
  transactions : []
};

while(state.capital > 0 && state.capital <= remainingCost(input.options)) {
  state.transactions.push(purchaseBulk(state, input.options));
  var remaining = remainingCost(input.options);
  if (remaining > 0) {
    if (state.capital + state.amount * input.market > remaining) {
      // Sell just enough to be able to purchase remaining options
      var amt = Math.ceil((remaining - state.capital) / input.market);
      var transaction = {
        type : 'SELL',
        amount : amt,
        price : input.market
      };
      state.capital += amt * input.market;
      state.amount -= amt;
      state.transactions.push(transaction);
    } else {
      // Sell all options
      var transaction = {
        type : 'SELL',
        amount : state.amount,
        price : input.market
      };
      state.capital += state.amount * input.market;
      state.amount = 0;
      state.transactions.push(transaction);
    }
  }
}

// Purchase remaining options with capital
while(remainingCost(input.options) > 0) {
  state.transactions.push(purchaseBulk(state, input.options));
}

console.log(state);

// Purchase as many cheap options in bulk as we can and return the transaction
function purchaseBulk(state, options) {
  for (var i=0; i<options.length; i++) {
    var cOptions = options[i];
    if (cOptions.amount > 0) {
      if (state.capital > cOptions.price * cOptions.amount) {
        // Purchase the remaining amount of a set of options
        var transaction = {
          type : 'BUY',
          amount : cOptions.amount,
          price : cOptions.price
        };
        state.capital -= cOptions.price * cOptions.amount;
        state.amount += cOptions.amount;
        cOptions.amount = 0;
        return transaction;
      } else {
        // Purchase as much we can of a set of options
        var amt = Math.floor(state.capital / cOptions.price);
        var transaction = {
          type : 'BUY',
          amount : amt,
          price : cOptions.price
        };
        state.capital -= cOptions.price * amt;
        state.amount += amt;
        cOptions.amount -= amt;
        return transaction;
      }
    }
  }
}

function compareOptions(optionA, optionB) {
  return optionA.price > optionB.price ? 1 : optionA.price < optionB.price ? -1 : 0;
}

// Cost to purchase remaining options
function remainingCost(options) {
  var total = 0;
  for (var i=0; i<options.length; i++) {
    total += options[i].price * options[i].amount;
  }
  return total;
}
