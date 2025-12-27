// what is anagram?
// - have same character
// - have same length

// function anagram(words) {
//   const group = {};

//   for (let i = 0; i < words.length; i++) {
//     const word = words[i];
//     // check list of character used. use it as key
//     const key = word.split("").sort().join("");
//     // have same character and length? hence same key
//     // if not, create new group
//     if (!group[key]) {
//       group[key] = [];
//     }
//     // store word to the group
//     group[key].push(word);
//   }

//   // convert object to array
//   return Object.values(group);
// }

function anagram(words) {
    var group = {};

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        // check list of character used. use it as key
        var key = sortChars(word);
        // have same character and length? hence same key
        // if not, create new group
        if (!group[key]) {
            group[key] = [];
        }
        // store word to the group
        group[key].push(word);
    }

    // convert object to array
    var result = [];
    for (var k in group) {
        result.push(group[k]);
    }
    return result;
}

function sortChars(str) {
    var chars = [];
    for (var i = 0; i < str.length; i++) {
        chars.push(str[i]);
    }
    for (var i = 0; i < chars.length; i++) {
        for (var j = 0; j < chars.length - 1 - i; j++) {
            if (chars[j] > chars[j + 1]) {
                var temp = chars[j];
                chars[j] = chars[j + 1];
                chars[j + 1] = temp;
            }
        }
    }
    var result = "";
    for (var i = 0; i < chars.length; i++) {
        result = result + chars[i];
    }
    return result;
}

const input = ["kita", "atik", "tika", "aku", "kia", "makan", "kua"];
const output = anagram(input);

console.log(output);
