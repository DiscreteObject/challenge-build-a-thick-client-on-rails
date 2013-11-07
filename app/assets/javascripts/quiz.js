SessionKey = function(){
  return 'gn92q7r3t4g8robih'
}

QuizHandler = {

  bindEventListeners: function(){
     $('#quiz-list').on("click", 'li', function(){
      QuizHandler.getQuizQuestion($(this).data('quiz-id') )
     })

     $('.question-goes-here').on("click", ".quiz-answer", function(){
        QuizHandler.checkSelectedAnswer($(this).data('quiz-choice-id'))
     })
  },

  getQuizQuestion: function(quizId){
    console.log("in getQuizQuestion", quizId)
    $.ajax({ url: "/quizzes/" + quizId + "/questions/next.json", method: 'get', data: {session_key: SessionKey()}
    }).done(function(server_response){
      console.log('first', server_response)
      QuizHandler.renderQuestion(server_response.question)
    }).fail(function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR.responseText)
    })

  },

  renderQuestion: function(question_data){
    console.log('rendering question', question_data)
    $('.quiz-list-container').addClass('hidden')
    var $quizElement = $('.quiz-question-container').clone()

    $quizElement.find('.quiz-question-title').html(question_data.question)
    $quizElement.attr('data-question-id', question_data.question_id )

    console.log($quizElement)
    for(var i = 0 ; i < question_data.choices.length; i++){
      $quizElement.find('.quiz-answers-list').append("<li class='quiz-answer' data-quiz-choice-id=" + (i+1) + "><a href=#>" + question_data.choices[i].choice + "</a></li>")
    }
    $('.question-goes-here').html($quizElement)
  },

  getQuizzesFromServer: function(){
    $.ajax( {url: '/quizzes.json', method: 'get', session_key: SessionKey()
    }).done(function(server_response){
      response = server_response
      var quizzes = response.quizzes
      QuizHandler.displayQuizzes(quizzes)
    })
  },

  displayQuizzes: function(quizArray){
    for( var i = 0 ; i < quizArray.length; i++){
      $('#quiz-list').append("<li class='quiz-name' data-quiz-id="+ (i+1) + "><a href=#>" + quizArray[i].name + "</a></li>")
    }
  },

  checkSelectedAnswer: function(selectedAnswerId){
    console.log('you picked', selectedAnswerId)
    console.log($('.quiz-question-container')[0])
    // currentQuestionID = $('.quiz-question-container')[0].data('question-id')
    // $.ajax({ url: "/questions/" + currentQuestionID + "/answers.json",
    //          type: "post",
    //          data: { session_key: SessionKey(), choice_id: selectedAnswerId
    //          } ).done(function(server_response){
    //           console.log('yay', server_response)
    //          }).fail(function(){
    //           console.log('you suck')
    //          })
  }
}


$(function(){
  console.log('ready')
  QuizHandler.bindEventListeners()
  QuizHandler.getQuizzesFromServer()
})
