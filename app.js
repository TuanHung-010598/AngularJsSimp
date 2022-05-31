var app = angular.module('myApp', []);
app.controller('myController', function ($scope) {
  var ACTION_TYPE = {
    ADD: 'Add',
    EDIT: 'Edit'
  };

  var CLASS_TITLE = {
      ALL : 'All',
      NOT_IN_CLASS : 'Not in any class'
  };

  $scope.isStudentPage = true;
  $scope.isStudentEdit = false;
  $scope.isClassEdit = false;
  $scope.students = studentArrays;
  $scope.classes = classArrays;
  $scope.studentAction = ACTION_TYPE.ADD;
  $scope.classAction = ACTION_TYPE.ADD;
  $scope.selectedClass = $scope.classes[1];
  $scope.classSelectedFilter = $scope.classes[0];

  // Student function
  $scope.editClick = editClick;
  $scope.deleteClick = deleteClick;
  $scope.addNewStudentClick = addNewStudentClick;
  $scope.saveClick = saveClick;
  $scope.studentEditCancel = studentEditCancel;
  $scope.filterClass = filterClass;
  $scope.goToClass = goToClass;
  $scope.searchClassFilter = searchClassFilter;
  $scope.getAllClassIdByClassID = getAllClassIdByClassID;

  // Class function
  $scope.goToStudent = goToStudent;
  $scope.editClassClick = editClassClick;
  $scope.addNewClassClick = addNewClassClick;
  $scope.saveClassClick = saveClassClick;
  $scope.deleteClassClick = deleteClassClick;
  $scope.cancelClassClick = cancelClassClick;
  $scope.showNameWithPrefix = showNameWithPrefix;
  $scope.getMaxChildOrderNumberByID = getMaxChildOrderNumberByID;

  function editClick(student) {
    $scope.tempStudent = student;
    $scope.studentAction = ACTION_TYPE.EDIT;
    $scope.isStudentEdit = true;
  }

  function deleteClick(student) {
    var index = $scope.students.findIndex(s => s.StudentId == student.StudentId);
    $scope.students.splice(index, 1);
  }

  function addNewStudentClick() {
    $scope.studentAction = ACTION_TYPE.ADD;
    $scope.tempStudent = {
      StudentId: getLastStudentID($scope.students) + 1,
      StudentName: '',
      StudentBirthday: new Date('01/01/2000'),
      ClassId: $scope.selectedClass.ClassId
    };
    $scope.isStudentEdit = true;
  }

  function saveClick() {
      if(!$scope.tempStudent.StudentName)
      {
          return;
      }
    if ($scope.studentAction == ACTION_TYPE.EDIT) {
      var index = $scope.students.findIndex(s => s.StudentId == $scope.tempStudent.StudentId);
      $scope.students[index].StudentName = $scope.tempStudent.StudentName;
      $scope.students[index].StudentBirthday = $scope.tempStudent.StudentBirthday;
      $scope.students[index].ClassId = $scope.selectedClass.ClassId;

      $scope.isStudentEdit = false;

    } else if ($scope.studentAction == ACTION_TYPE.ADD) {
      $scope.tempStudent.ClassId = $scope.selectedClass.ClassId;
      $scope.students.push($scope.tempStudent);
      $scope.isStudentEdit = false;
    }
  }

  function studentEditCancel() {
    $scope.isStudentEdit = false;
  }

  function filterClass(c) {
    return c.ClassId > 0;
  }

  function goToClass() {
    $scope.isStudentPage = false;
  }

  function searchClassFilter(s) {
    if (Object.keys($scope.classSelectedFilter).length == 0) {
      return s;
    } else if ($scope.classSelectedFilter.ClassId == 0) {
      return s;
    } else {
      $scope.listResult = [];
      return $scope.getAllClassIdByClassID($scope.classSelectedFilter.ClassId).indexOf(s.ClassId) > -1;
    }
  }

  function getAllClassIdByClassID(classID) {
    $scope.listResult.push(classID);
    var listChild = $scope.classes.filter(c => {
      return c.ParentId == classID;
    });
    if (!listChild.length) {
      return $scope.listResult;
    } else {
      listChild.forEach(element => {
        $scope.getAllClassIdByClassID(element.ClassId);
      });
    }

    return $scope.listResult;
  }

  function getLastStudentID(obj) {
    var tempStudents = $scope.students.map( object => {
        return object.StudentId;
    })

    return parseInt(Math.max(...tempStudents),10);
  }

  function goToStudent() {
    $scope.isStudentPage = true;
  }

  function editClassClick(c) {
    $scope.classAction = ACTION_TYPE.EDIT;
    $scope.classes[0].ClassName = CLASS_TITLE.NOT_IN_CLASS;
    $scope.parentClass = $scope.classes[c.ParentId];
    $scope.tempClass = c;
    $scope.isClassEdit = true;
  }

  function deleteClassClick(c) {
    var index = $scope.classes.findIndex(cl => cl.ClassId == c.ClassId);
    $scope.classes.splice(index, 1);
    $scope.isClassEdit = false;
  }

  function addNewClassClick() {
    $scope.tempClass = {
      ClassId: getLastClassID($scope.classes) + 1,
      ClassName: '',
      Prefix: '',
      ParentId: 0,
      OrderNumber: 0
    };
    $scope.classes[0].ClassName = CLASS_TITLE.NOT_IN_CLASS;
    $scope.parentClass = $scope.classes[0];

    $scope.classAction = ACTION_TYPE.ADD;

    $scope.isClassEdit = true;
  }

  function getLastClassID() {
      var tempClasses = $scope.classes.map( object => {
          return object.ClassId;
      })

      return parseInt(Math.max(...tempClasses),10);
  }

  function saveClassClick() {
    if(!$scope.tempClass.ClassName)
    {
        return;
    }
    if ($scope.classAction == ACTION_TYPE.ADD) {
      rebuildClass();
      $scope.classes.push($scope.tempClass);
    } else if ($scope.classAction == ACTION_TYPE.EDIT) {
      var index = $scope.classes.findIndex(c => c.ClassId == $scope.tempClass.ClassId);
      rebuildClass();
      $scope.classes[index] = $scope.tempClass;
    }
    $scope.isClassEdit = false;
    $scope.classes[0].ClassName = CLASS_TITLE.ALL;
  }

  function cancelClassClick() {
    $scope.isClassEdit = false;
    $scope.classes[0].ClassName = CLASS_TITLE.ALL;
  }

  function showNameWithPrefix(item) {
    return item.Prefix + item.ClassName;
  }

  function rebuildClass() {
    if ($scope.parentClass.ClassId == 0) {
      $scope.tempClass.ParentId = 0;
      $scope.tempClass.Prefix = '';
      $scope.tempClass.OrderNumber = getMaxOrderNumber($scope.classes) + 1;
    } else {
      var maxOrderNumberInParentClass = getMaxChildOrderNumberByID($scope.parentClass.ClassId);
      var maxOrderNumberInClass = getMaxOrderNumber($scope.classes);

      $scope.classes.forEach(c => {
        if (c.OrderNumber > maxOrderNumberInParentClass && c.OrderNumber <= maxOrderNumberInClass) {
          c.OrderNumber++;
        }
      });
      $scope.tempClass.OrderNumber = parseInt(maxOrderNumberInParentClass, 10) + 1;
      $scope.tempClass.Prefix = $scope.parentClass.Prefix + '-';
      $scope.tempClass.ParentId = $scope.parentClass.ClassId;
    }
  }

  function getMaxOrderNumber(array) {
    var listOrderNumber = array.map(object => {
      return object.OrderNumber;
    });

    return parseInt(Math.max(...listOrderNumber), 10);
  }

  function getMaxChildOrderNumberByID(classID) {
    var maxOrderNumber = $scope.classes[$scope.classes.findIndex(c => c.ClassId == classID)].OrderNumber;

    var listChild = $scope.classes.filter((obj) => {
      return obj.ParentId == classID;
    })

    if (listChild.length == 0) {
      return maxOrderNumber;
    } else {
      listChild.forEach(element => {
        if (maxOrderNumber < getMaxChildOrderNumberByID(element.ClassId)) {
          maxOrderNumber = getMaxChildOrderNumberByID(element.ClassId);
        }
      });
    }
    return parseInt(maxOrderNumber, 10);
  }
});

app.filter('toAge', function () {
  return function (value) {
    var date = new Date(value);
    var dateDiff = new Date() - date;
    var age = new Date(dateDiff);
    return Math.abs(age.getUTCFullYear() - 1970);
  }
});

app.filter('toClassName', function () {
  return function (value, scope) {
    var index = scope.classes.findIndex(c => c.ClassId == value);
    return scope.classes[index].ClassName;
  }
});

var studentArrays = [{
    StudentId: 1,
    StudentName: 'An Do',
    StudentBirthday: new Date('12/07/2004'),
    ClassId: 1
  },
  {
    StudentId: 2,
    StudentName: 'Nguyen Ngoc',
    StudentBirthday: new Date('12/12/2006'),
    ClassId: 2
  },
  {
    StudentId: 3,
    StudentName: 'Hung',
    StudentBirthday: new Date('01/05/1998'),
    ClassId: 2
  },
];

var classArrays = [

  {
    ClassId: 0,
    ClassName: 'All',
    Prefix: '',
    ParentId: 0,
    OrderNumber: 0
  },
  {
    ClassId: 1,
    ClassName: '10',
    Prefix: '',
    ParentId: 0,
    OrderNumber: 1
  },
  {
    ClassId: 2,
    ClassName: '10A1',
    Prefix: '-',
    ParentId: 1,
    OrderNumber: 2
  },
  {
    ClassId: 3,
    ClassName: '11',
    Prefix: '',
    ParentId: 0,
    OrderNumber: 3
  }
];