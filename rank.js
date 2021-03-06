var questions = [
    {"title": "foo", "candidates": ["A", "B", "C", "D"]},
    {"title": "bar", "candidates": ["D", "E", "F", "G"]},
];

var voters = ["addr1", "addr2", "addr3", "addr4"];

var secrets_to_candidates = {
    "secret1": {"question": 0, "candidate": 0},
    "secret2": {"question": 0, "candidate": 1},
    "secret3": {"question": 0, "candidate": 2},
    "secret4": {"question": 0, "candidate": 3},
    "1secret1": {"question": 0, "candidate": 0},
    "1secret2": {"question": 0, "candidate": 1},
    "1secret3": {"question": 0, "candidate": 2},
    "1secret4": {"question": 0, "candidate": 3},
    "2secret1": {"question": 0, "candidate": 0},
    "2secret2": {"question": 0, "candidate": 1},
    "2secret3": {"question": 0, "candidate": 2},
    "2secret4": {"question": 0, "candidate": 3},
};

var votes = {
    "addr1": [["secret2", "secret1", "secret4", "secret3"]],
    "addr2": [["1secret3", "1secret1", "1secret2", "1secret4"]],
    "addr3": [["2secret2", "2secret3", "2secret1"]],
};

var async_fetch_vote = function(address, question_number, preference_number, callback) {
    setTimeout(function() {
        try {
            // console.log("async fetch:", votes[address]);
            callback(address, question_number, preference_number, votes[address][question_number][preference_number]);
        } catch(err) {
            // console.log("Error:", err);
            callback(address, question_number, preference_number, null);
        }
    }, parseInt(Math.random() * 1000));
};

/**** Ranking algorithm starts here ****/
var trim_candidates = function(address_to_votes, candidate_to_votes) {
    // console.log(address_to_votes, candidate_to_votes);
    for(var question_id in candidate_to_votes) {
        var current_candidates = candidate_to_votes[question_id]
        var done = false;
        while(!done) {
            var all_equal = true;
            var lengths = [];
            for(var i in current_candidates) {
                if(current_candidates[i]) lengths.push(current_candidates[i].length);
            }
            // console.log(lengths);
            for(var i = 0; i < lengths.length; i++) {
                for(var j = 0; j < lengths.length; j++) {
                    if(lengths[i] != lengths[j]) all_equal = false;
                }
            }
            // console.log("all equal:", all_equal);
            if(all_equal) {
                done = true;
            }
            else {
                var lowest_index = 0;
                for(var index in current_candidates) {
                    if(!current_candidates[index]) continue;
                    if(current_candidates[index].length < current_candidates[lowest_index].length) {
                        lowest_index = index;
                    }
                }
                // console.log(current_candidates, "about to remove:", lowest_index);
                for(var address_index in current_candidates[lowest_index]) {
                    var address = current_candidates[lowest_index][address_index];
                    // console.log("before removal:", address_to_votes[address][question_id]);
                    var next_candidate_index = address_to_votes[address][question_id][0];
                    while(next_candidate_index == lowest_index || !current_candidates[next_candidate_index]) {
                        address_to_votes[address][question_id].splice(0, 1);
                        // console.log("remaining votes for ", address, ":", address_to_votes[address][question_id]);
                        next_candidate_index = address_to_votes[address][question_id][0];
                    }
                    current_candidates[next_candidate_index].push(address);
                }
                current_candidates[lowest_index] = null;
            }
        }
    }
    console.log("Done!  Candidates remaining are:", candidate_to_votes);
};

var massage_data = function() {
    var shitty_semaphore = 0;
    var address_to_votes = {};
    var candidate_to_votes = [];
    for(var i in voters) {
        address_to_votes[voters[i]] = [];
    }
    for(var question_id in questions) {
        // console.log("on question:", question_id);
        var question = questions[question_id];
        var candidates = question["candidates"];
        candidate_to_votes[question_id] = [];
        // console.log("1");
        for(var candidate_number in candidates) {
            candidate_to_votes[question_id][candidate_number] = [];
        }
        // console.log("2");
        for(var i in voters) {
            address_to_votes[voters[i]][question_id] = [];
        }
        // console.log("3");
        for(var preference_number = 0; preference_number < candidates.length; preference_number++) {
            for(var address_index in voters) {
                var address = voters[address_index];
                // console.log("4", "address:", address, "question:", question_id, "pref", preference_number);
                shitty_semaphore++;
                async_fetch_vote(address, question_id, preference_number, function(address, question_number, preference_number, result) {
                    // console.log("result:", result);
                    if(result) {
                        var candidate_number = secrets_to_candidates[result]["candidate"];
                        // console.log("a");
                        address_to_votes[address][question_number][preference_number] = candidate_number;
                        // console.log("b");
                        if(preference_number == 1) {
                            candidate_to_votes[question_number][candidate_number].push(address);
                        }
                        // console.log("result:", result, "candidate number:", candidate_number, address_to_votes, candidate_to_votes);
                    }
                    shitty_semaphore--;
                    // console.log("semaphore:", shitty_semaphore);
                    if(shitty_semaphore == 0) trim_candidates(address_to_votes, candidate_to_votes);
                });
            }
        }
    }
};

massage_data();