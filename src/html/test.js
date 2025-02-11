// main.js

const BASE_URL = 'https://your-backend-api.com'; // Replace with your real API endpoint if needed

// =========================
// LOGIN STATE & NAVBAR TOGGLING
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // Check if the user is logged in (using localStorage in this example)
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  // Get the navbar elements by their IDs
  const publicNav = document.getElementById('publicNav');
  const userNav = document.getElementById('userNav');

  if (isLoggedIn) {
    // Hide the public navbar and show the user-specific navbar
    publicNav.classList.add('hidden');
    userNav.classList.remove('hidden');
  } else {
    // Show the public navbar and hide the user-specific navbar
    publicNav.classList.remove('hidden');
    userNav.classList.add('hidden');
  }

  // Attach logout functionality to the Logout button, if it exists
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('loggedIn');
      window.location.reload();
    });
  }

  // Call functions to load dynamic content
  loadCategories();
  loadBlogs();
  loadReviews();
});

// =========================
// 1. CATEGORIES
// =========================
async function loadCategories() {
  try {
    // Uncomment and modify when you have a real API endpoint:
    // const response = await fetch(`${BASE_URL}/categories`);
    // const categories = await response.json();

    // TEMP: Hardcoded data for demonstration
    const categories = [
      {
        name: 'Credit Cards',
        image: '../images/credit-card.png',
      },
      {
        name: 'Home Loans',
        image: '../images/personal.png',
      },
      {
        name: 'Insurance',
        image: '../images/property-insuarence.png',
      },
      {
        name: 'Investments',
        image: '../images/investment.png',
      },
    ];

    if (!categories || !categories.length) {
      showNoCategoryFound();
      return;
    }
    renderCategories(categories);
  } catch (err) {
    console.error('Error loading categories:', err);
    showNoCategoryFound();
  }
}

function renderCategories(categories) {
  const container = document.getElementById('categories');
  container.innerHTML = '';

  categories.forEach((cat) => {
    const div = document.createElement('div');
    div.classList.add('w-48', 'flex', 'flex-col', 'items-center');

    const img = document.createElement('img');
    img.src = cat.image;
    img.alt = cat.name;
    img.classList.add('h-24', 'mb-2');

    const title = document.createElement('h6');
    title.classList.add('font-semibold', 'text-center');
    title.textContent = cat.name;

    div.appendChild(img);
    div.appendChild(title);
    container.appendChild(div);
  });
}

function showNoCategoryFound() {
  const container = document.getElementById('categories');
  container.innerHTML = `
    <div class="w-48 flex flex-col items-center">
      <img
        src="https://via.placeholder.com/100?text=No+Category"
        alt="No Category"
        class="h-24 mb-2"
      />
      <h6 class="font-semibold text-center">No Category Found</h6>
    </div>
  `;
}

// =========================
// 2. BLOGS (Alternating Layout)
// =========================
async function loadBlogs() {
  try {
    // Uncomment and modify when you have a real API endpoint:
    // const response = await fetch(`${BASE_URL}/blogs`);
    // const blogs = await response.json();

    // TEMP: Hardcoded data for demonstration
    const blogs = [
      {
        title: '5 Tips to Improve Your Credit Score',
        summary:
          'Enhance your credit score by paying bills on time, reducing debt levels, regularly checking your credit reports for errors, limiting new credit applications, and diversifying the types of credit you hold. Each of these steps contributes to a stronger financial profile and better creditworthiness.',
        image: '../images/image1.png',
        link: '#',
      },
      {
        title: 'Home Loan Basics',
        summary:
          'Understand the fundamentals of securing a home loan by familiarizing yourself with different interest rates, types of loans, and credit requirements. Know the steps of the loan application process and the factors that influence loan approval to navigate the home buying journey effectively.',
        image: '../images/image.png',
        link: '#',
      },
      {
        title: 'Choosing the Right Insurance',
        summary:
          'Learn how to pick the perfect insurance plan that fits your lifestyle and budget.',
        image: 'https://via.placeholder.com/600x400?text=Insurance',
        link: '#',
      },
      {
        title: 'Investment Strategies',
        summary:
          'From stocks to mutual funds, discover strategies that can help grow your wealth over time.',
        image: 'https://via.placeholder.com/600x400?text=Investments',
        link: '#',
      },
    ];

    // Limit the blogs to only the first two items
    const limitedBlogs = blogs.slice(0, 2);

    if (!limitedBlogs || !limitedBlogs.length) {
      showNoBlogsFound();
      return;
    }
    renderBlogs(limitedBlogs);
  } catch (err) {
    console.error('Error loading blogs:', err);
    showNoBlogsFound();
  }
}

/** Renders blog posts in an alternating L-R / R-L style without the "Read More" link. */
function renderBlogs(blogs) {
  const blogContainer = document.getElementById('blogContainer');
  blogContainer.innerHTML = '';

  blogs.forEach((blog, index) => {
    // Create a wrapper for the blog post
    const rowDiv = document.createElement('div');
    // Determine if we need to reverse the layout (odd-indexed items)
    const isReversed = index % 2 !== 0;
    rowDiv.classList.add('flex', 'flex-col', 'md:flex-row', 'items-center', 'gap-6');
    if (isReversed) {
      rowDiv.classList.add('md:flex-row-reverse');
    }

    // Create image element with a smaller container width
    const img = document.createElement('img');
    img.src = blog.image;
    img.alt = blog.title;
    img.classList.add('w-full', 'md:w-1/4', 'rounded-lg', 'shadow');

    // Create text container
    const textDiv = document.createElement('div');
    textDiv.classList.add('md:w-3/4');

    const title = document.createElement('h3');
    title.classList.add('text-2xl', 'font-bold', 'mb-1');
    title.textContent = blog.title;

    const summary = document.createElement('p');
    summary.classList.add('text-gray-700', 'mb-1');
    summary.textContent = blog.summary;

    // Append title and summary only (removed the "Read More" link)
    textDiv.appendChild(title);
    textDiv.appendChild(summary);

    rowDiv.appendChild(img);
    rowDiv.appendChild(textDiv);

    blogContainer.appendChild(rowDiv);
  });
}

function showNoBlogsFound() {
  const container = document.getElementById('blogContainer');
  container.innerHTML = `
    <p class="text-center text-gray-500">
      No blog posts available at the moment.
    </p>
  `;
}

// =========================
// 3. REVIEWS (Testimonials)
// =========================
async function loadReviews() {
  try {
    // Uncomment and modify the line below when you have a real API endpoint:
    // const response = await fetch(`${BASE_URL}/reviews`);
    // const reviews = await response.json();

    // TEMP: Hardcoded data for demonstration
    const reviews = [
      {
        name: 'John D.',
        review:
          'FinSolutions made it so easy to find the right credit card for my needs. Saved me a ton of money!',
        rating: 5,
      },
      {
        name: 'Ava S.',
        review:
          'I never thought getting a home loan could be this straightforward. Fantastic service and support!',
        rating: 4,
      },
      {
        name: 'Michael T.',
        review:
          'Their insurance comparison tool is top-notch. I quickly found a plan that suited my budget.',
        rating: 5,
      },
    ];

    if (!reviews || !reviews.length) {
      showNoReviewsFound();
      return;
    }
    renderReviews(reviews);
  } catch (err) {
    console.error('Error loading reviews:', err);
    showNoReviewsFound();
  }
}

/** Renders reviews in a grid layout. */
function renderReviews(reviews) {
  const reviewContainer = document.getElementById('reviewContainer');
  reviewContainer.innerHTML = '';

  reviews.forEach((rev) => {
    const card = document.createElement('div');
    card.classList.add('bg-white', 'rounded-lg', 'shadow', 'p-6', 'flex', 'flex-col', 'justify-between');

    const text = document.createElement('p');
    text.classList.add('text-gray-700', 'mb-4');
    text.textContent = rev.review;

    const author = document.createElement('div');
    author.classList.add('font-semibold', 'text-blue-600');
    author.textContent = `- ${rev.name}`;

    // Generate star rating
    const stars = document.createElement('div');
    stars.classList.add('text-yellow-500', 'mt-2');
    const starCount = rev.rating || 0;
    stars.innerHTML = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

    card.appendChild(text);
    card.appendChild(author);
    card.appendChild(stars);

    reviewContainer.appendChild(card);
  });
}

function showNoReviewsFound() {
  const container = document.getElementById('reviewContainer');
  container.innerHTML = `
    <p class="text-center text-gray-500">
      No reviews yet.
    </p>
  `;
}

// =========================
// CREDIT SCORE REDIRECT
// =========================
function redirectToCreditScorePage() {
  // Replace with your actual route if needed
  window.location.href = 'credit-score.html';
}
document.addEventListener('DOMContentLoaded', () => {
  // Get the current file name (e.g., "products.html" or "index.html").
  // If the pathname is empty, default to "index.html".
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  console.log("Current file:", currentFile);

  // Select all nav links within the navbar (ensure your <ul> has an id="navbar")
  const navLinks = document.querySelectorAll('#navbar a');

  navLinks.forEach(link => {
    // Get the href attribute from the link (e.g., "products.html")
    const linkPath = link.getAttribute('href');
    // Compare the current file to the link's href exactly
    if (linkPath === currentFile) {
      // Add active styling
      link.classList.add('text-blue-600', 'font-semibold');
    } else {
      // Remove active styling (in case it was added previously)
      link.classList.remove('text-blue-600', 'font-semibold');
    }
  });
});