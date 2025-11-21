/* eslint-disable no-await-in-loop */
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ------------------------------------------
    // 1) USERS
    // ------------------------------------------
    const password = await bcrypt.hash("Password123!", 10);

    const admin = {
      email: "admin@learnhub.com",
      password_hash: password,
      role: "Admin",
      first_name: "Alice",
      last_name: "Admin",
      isDeleted: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const students = [
      ["ethan", "Ray"],
      ["mia", "Khan"],
      ["liam", "Chen"],
      ["sophia", "Singh"],
      ["noah", "Iyer"],
      ["ava", "Patel"],
      ["oliver", "Das"],
      ["isabella", "Roy"],
      ["james", "Banerjee"],
      ["emily", "Mehta"],
      ["henry", "Chawla"],
      ["charlotte", "Nair"],
      ["benjamin", "Kumar"],
      ["amelia", "Rao"],
      ["lucas", "Fernandes"],
      ["harper", "Menon"],
      ["elijah", "Dasgupta"],
      ["abigail", "Sharma"],
    ].map(([first, last]) => ({
      email: `${first.toLowerCase()}@gmail.com`,
      password_hash: password,
      role: "Student",
      first_name: first.charAt(0).toUpperCase() + first.slice(1),
      last_name: last,
      isDeleted: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Users", [admin, ...students], {});

    // Fetch all users back WITH auto-generated IDs
    const [userRows] = await queryInterface.sequelize.query(
      `SELECT id, email, role FROM "Users" ORDER BY id ASC`
    );

    const adminId = userRows.find((u) => u.role === "Admin").id;
    const studentIds = userRows
      .filter((u) => u.role === "Student")
      .map((u) => u.id);

    // ------------------------------------------
    // 2) COURSES
    // ------------------------------------------
    const thumbnailUrls = [
      "https://miro.medium.com/v2/resize:fit:1400/1*tDvPpTA8Jw5P_B5xV8gsjw.jpeg",
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiz8D-sFeAY249WfDJNSWanrKF3ZoF5V03xrnEm_EDbAM1zcSufZjhxbhsmAFiMB0fPhoBwDbeyObzIYvSE59XHvfUdJVCyn5G6VK4KQLbaCARiMpW5J8o2y2vgc5qB1jXxIEoGNgUc5vo/w433-h244/image.png",
      "https://unicminds.com/wp-content/uploads/2024/02/Maths-Classes-for-Kids-UnicMinds.webp",
      "https://img-c.udemycdn.com/course/750x422/4941938_dcd9_17.jpg",
      "https://cdn.mindmajix.com/courses/cloud-security-training-03082022.png",
      "https://i.ytimg.com/vi/F2FmTdLtb_4/hq720.jpg",
      "https://img-c.udemycdn.com/course/750x422/5719868_a5fa_2.jpg",
      "https://i.ytimg.com/vi/mEsleV16qdo/hq720.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWaXOq3heEh_mDLIgEzm4juLpSS-IrmGNgA&s",
      "https://img-c.udemycdn.com/course/750x422/1638522_fbdf.jpg",
      "https://courses.apexhours.com/wp-content/uploads/2023/03/1646033829.jpg",
      "https://img-c.udemycdn.com/course/750x422/1708340_7108_5.jpg",
    ];

    const courseMeta = [
      ["Modern JavaScript Essentials", 499.99, "Published"],
      ["Python for Problem Solving", 599.99, "Published"],
      ["Fun with Mathematics", 399.99, "Published"],
      ["Java Masterclass", 699.99, "Published"],
      ["Cloud Security Fundamentals", 799.99, "Published"],
      ["System Design Foundations", 899.99, "Published"],
      ["Compiler Design Basics", 649.99, "Published"],
      ["Introduction to Generative AI", 999.99, "Published"],
      ["Angular Frontend Development", 749.99, "Published"],
      ["Node.js Backend APIs", 599.99, "Draft"],
      ["Salesforce Platform Essentials", 849.99, "Draft"],
      ["Flutter Mobile Apps", 699.99, "Draft"],
    ];

    const coursesToInsert = courseMeta.map(([name, price, status], idx) => ({
      course_name: name,
      description: `Learn ${name} from scratch.`,
      price,
      status,
      adminId,
      thumbnailUrl: thumbnailUrls[idx],
      totalEnrollments: 0,
      isDeleted: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Courses", coursesToInsert, {});

    // Get actual course rows with auto IDs
    const [courseRows] = await queryInterface.sequelize.query(
      `SELECT id, status FROM "Courses" ORDER BY id ASC`
    );

    const publishedCourses = courseRows
      .filter((c) => c.status === "Published")
      .map((c) => c.id);

    // ------------------------------------------
    // 3) COURSE CONTENT
    // ------------------------------------------
    const youtubeLinks = [
      "https://www.youtube.com/embed/X8ipUgXH6jw",
      "https://www.youtube.com/embed/s2skans2dP4",
      "https://www.youtube.com/embed/T-D1OfcDW1M",
      "https://www.youtube.com/embed/8aGhZQkoFbQ",
      "https://www.youtube.com/embed/wIxFBCMW7P0",
    ];

    const titlesMap = {
      1: [
        "Intro to JavaScript",
        "Variables",
        "Functions",
        "DOM Basics",
        "Async",
      ],
      2: ["Intro to Python", "Data Types", "Control Flow", "Modules"],
      3: ["Intro to Math", "Algebra", "Geometry"],
      4: ["Intro to Java", "OOP", "Collections", "Exceptions"],
      5: ["Intro to Cloud Security", "IAM", "Network Security", "Monitoring"],
      6: ["Intro to System Design", "Scalability", "Caching", "DB Design"],
      7: ["Intro to Compiler Design", "Lexical", "Parsing", "Semantic"],
      8: ["Intro to Gen AI", "LLMs", "Prompting"],
      9: ["Intro to Angular", "Components", "Routing"],
      10: ["Intro to Node.js", "Event Loop", "REST"],
      11: ["Intro to Salesforce", "Objects", "Automation"],
      12: ["Intro to Flutter", "Widgets", "State Mgmt"],
    };

    const contents = [];

    courseRows.forEach((c) => {
      const titles = titlesMap[c.id];
      titles.forEach((title, index) => {
        contents.push({
          courseId: c.id,
          title,
          content: youtubeLinks[(index + c.id) % youtubeLinks.length],
          order_index: index + 1,
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    await queryInterface.bulkInsert("CourseContent", contents, {});

    // ------------------------------------------
    // 4) ENROLLMENTS (random from 9 published)
    // ------------------------------------------
    const enrollments = [];
    const enrollmentCounts = {};

    for (const userId of studentIds) {
      const enrollCount = 1 + Math.floor(Math.random() * 3);
      const chosen = new Set();

      while (chosen.size < enrollCount) {
        const randomCourse =
          publishedCourses[Math.floor(Math.random() * publishedCourses.length)];
        chosen.add(randomCourse);
      }

      for (const courseId of chosen) {
        enrollments.push({
          userId,
          courseId,
          enrollment_date: now,
          status: "Active",
          createdAt: now,
          updatedAt: now,
        });

        enrollmentCounts[courseId] = (enrollmentCounts[courseId] || 0) + 1;
      }
    }

    await queryInterface.bulkInsert("Enrollments", enrollments, {});

    // ------------------------------------------
    // 5) UPDATE totalEnrollments
    // ------------------------------------------
    for (const course of courseRows) {
      await queryInterface.bulkUpdate(
        "Courses",
        { totalEnrollments: enrollmentCounts[course.id] || 0 },
        { id: course.id }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Enrollments", null, {});
    await queryInterface.bulkDelete("CourseContent", null, {});
    await queryInterface.bulkDelete("Courses", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
