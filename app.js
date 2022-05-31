
var app = angular.module('myApp', []);
app.controller('myController', function ($scope) {
    $scope.isStudentPage = true;
    $scope.isStudentEdit = false;
    $scope.isClassEdit = false;
    $scope.students = studentArrays;
    $scope.classes = classArrays;
    $scope.studentAction = 'Add';
    $scope.classAction = 'Add';
    $scope.selectedClass = $scope.classes[1];
    $scope.classSelectedFilter = $scope.classes[0];

    $scope.editClick = (student) => {
        $scope.tempStudent = student;
        $scope.studentAction = 'Edit'
        $scope.isStudentEdit = true;
    }

    $scope.deleteClick = (student) => {
        var index = $scope.students.findIndex(s => s.StudentId == student.StudentId);
        $scope.students.splice(index, 1);
    }

    $scope.addNewStudentClick = () => {
        $scope.studentAction = 'Add';
        $scope.tempStudent = { StudentId: getLastID($scope.students) + 1, StudentName: '', StudentBirthday: new Date('01/01/2000'), ClassId: $scope.selectedClass.ClassId };
        $scope.isStudentEdit = true;
    }

    $scope.saveClick = () => {
        if ($scope.studentAction == 'Edit') {
            var index = $scope.students.findIndex(s => s.StudentId == $scope.tempStudent.StudentId);
            $scope.students[index].StudentName = $scope.tempStudent.StudentName;
            $scope.students[index].StudentBirthday = $scope.tempStudent.StudentBirthday;
            $scope.students[index].ClassId = $scope.selectedClass.ClassId;

            alert(`Editing student ${$scope.tempStudent.StudentName} done !`);
            $scope.isStudentEdit = false;

        }
        else if ($scope.studentAction == 'Add') {
            $scope.tempStudent.ClassId = $scope.selectedClass.ClassId;
            $scope.students.push($scope.tempStudent);
            $scope.isStudentEdit = false;
        }
    }

    $scope.studentEditCancel = () => {
        $scope.isStudentEdit = false;
    }

    $scope.filterClass = (c) => {
        return c.ClassId > 0;
    }

    $scope.goToClass = () => {
        $scope.isStudentPage = false;
    }
    $scope.searchClassFilter = (s) => {
        if (Object.keys($scope.classSelectedFilter).length == 0) {
            return s;
        }
        else if ($scope.classSelectedFilter.ClassId == 0) {
            return s;
        }
        else {
            return s.ClassId == $scope.classSelectedFilter.ClassId;
        }
    }
    function getLastID(obj) {
        return parseInt(Object.keys(obj).pop());
    }

    $scope.goToStudent = () => {
        $scope.isStudentPage = true;
    }

    $scope.editClassClick = (c) => {
        $scope.classAction = 'Edit';
        $scope.classes[0].ClassName = 'Not in any class'
        $scope.parentClass = $scope.classes[c.ParentId];
        console.log($scope.parentClass);
        $scope.tempClass = c;
        $scope.isClassEdit = true;
    }

    $scope.deleteClassClick = (c) => {
        var index = $scope.classes.findIndex(cl => cl.ClassId == c.ClassId);
        $scope.classes.splice(index, 1);
        $scope.isClassEdit = false;
    };

    $scope.addNewClassClick = () => {
        $scope.tempClass = { ClassId: getLastID($scope.classes) + 1, ClassName: '', Prefix: '', ParentId: null, OrderNumber: 10 };
        $scope.classes[0].ClassName = 'Not in any class'
        $scope.parentClass = $scope.classes[0];

        $scope.classAction = 'Add';

        $scope.isClassEdit = true;
    }
    $scope.saveClassClick = () => {
        if ($scope.classAction == 'Add') {
            reBuildClass();
            $scope.classes.push($scope.tempClass);
        }
        else if ($scope.classAction == 'Edit') {
            var index = $scope.classes.findIndex(c => c.ClassId == $scope.tempClass.ClassId);
            reBuildClass();
            $scope.classes[index] = $scope.tempClass;
        }
        $scope.isClassEdit = false;
        $scope.classes[0].ClassName = "All";
    };

    $scope.cancelClassClick = () => {
        $scope.isClassEdit = false;
        $scope.classes[0].ClassName = "All";
    }

    $scope.showNameWithPrefix = function (item) {
        return item.Prefix + item.ClassName;
    }
    function reBuildClass() {
        if ($scope.parentClass.ClassId == 0) {
            $scope.tempClass.ParentId = null;
            $scope.tempClass.Prefix = '';
            $scope.tempClass.OrderNumber = getMaxOrderNumber($scope.classes) + 1;
        }
        else {
            var listClassInParent = $scope.classes.filter((c) => {
                return c.ParentId == $scope.parentClass.ClassId;
            });
            var maxOrderNumberInParentClass;
            if (listClassInParent.length == 0) {
                maxOrderNumberInParentClass = $scope.parentClass.OrderNumber;
            }
            else {
                maxOrderNumberInParentClass = listClassInParent.slice(-1)[0].OrderNumber;
            }

            var maxOrderNumberInClass = getMaxOrderNumber($scope.classes);
            $scope.classes.forEach(c => {
                if (c.OrderNumber > maxOrderNumberInParentClass && c.OrderNumber <= maxOrderNumberInClass) {
                    c.OrderNumber++;
                }
            });
            $scope.tempClass.OrderNumber = parseInt(maxOrderNumberInParentClass) + 1;
            $scope.tempClass.Prefix = $scope.parentClass.Prefix + '-';
            $scope.tempClass.ParentId = $scope.parentClass.ClassId;
        }
    }

    function getMaxOrderNumber(array) {
        var listOrderNumber = array.map(object => {
            return object.OrderNumber;
        });

        return parseInt(Math.max(...listOrderNumber));
    }
});

app.filter('toAge', function () {
    return function (value) {
        var date = new Date(value);
        var dateDiff = new Date() - date;
        var age = new Date(dateDiff);
        return Math.abs(age.getUTCFullYear() - 1970);
    }
})

app.filter('toClassName', function () {
    return function (value, scope) {
        var index = scope.classes.findIndex(c => c.ClassId == value);
        return scope.classes[index].ClassName;
    }
})

var studentArrays = [
    { StudentId: 1, StudentName: 'An Do', StudentBirthday: new Date('12/07/2004'), ClassId: 1 },
    { StudentId: 2, StudentName: 'Nguyen Ngoc', StudentBirthday: new Date('12/12/2006'), ClassId: 2 },
    { StudentId: 3, StudentName: 'Hung', StudentBirthday: new Date('01/05/1998'), ClassId: 2 },
]

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
]