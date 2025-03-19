from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.edge.service import Service as EdgeService
import time
import logging
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from selenium.common.exceptions import NoSuchElementException, UnexpectedAlertPresentException

# Configure logging
logging.basicConfig(filename='test_log.log', level=logging.INFO, format='%(asctime)s - %(message)s')

# Setup browser using webdriver_manager
def setup_browser(browser_name):
    if browser_name == "chrome":
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    #elif browser_name == "firefox":
        #driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))
    elif browser_name == "edge":
        driver = webdriver.Edge(service=EdgeService(EdgeChromiumDriverManager().install()))
    else:
        raise ValueError("Unsupported browser!")
    return driver

# Helper function to sign in
def sign_in(driver):
    try:
        username_input = driver.find_element(By.ID, "username")
        username_input.send_keys("TestUser")
        sign_in_button = driver.find_element(By.XPATH, "//button[contains(text(),'Sign In')]")
        sign_in_button.click()
        time.sleep(2)  # Allow UI to update
        logging.info("Signed in successfully")
    except NoSuchElementException:
        logging.error("Sign-in elements not found")

# Test Scenario 1: Verify Page Load
def test_page_load(driver, url):
    driver.get(url)
    time.sleep(2)
    assert "E-Library Management" in driver.title, "Page title mismatch"
    logging.info(f"Page loaded successfully with title: {driver.title}")

# Test Scenario 2: Search for a Book
def test_search_book(driver, book_name):
    try:
        search_box = driver.find_element(By.ID, "search-box")
        search_box.send_keys(book_name)
        search_box.send_keys(Keys.RETURN)
        time.sleep(2)
        results = driver.find_element(By.ID, "search-results")
        assert book_name in results.text, "Book not found"
        logging.info(f"Searched for '{book_name}' and found results successfully.")
    except NoSuchElementException:
        logging.error(f"Search box or results not found for book: {book_name}")

# Test Scenario 3: Borrow a Book
def test_borrow_book(driver, book_name):
    try:
        book_element = driver.find_element(By.XPATH, f"//div[text()='{book_name}']/following-sibling::button[text()='Borrow']")
        book_element.click()
        time.sleep(2)
        borrow_count = driver.find_element(By.ID, "borrow-count").text
        assert int(borrow_count) > 0, "Borrow count not updated"
        logging.info(f"Borrowed '{book_name}' successfully. Count updated to {borrow_count}")
    except NoSuchElementException:
        logging.error(f"Borrow button for '{book_name}' not found.")

# Test Scenario 4: Check Borrowing Limit
def test_borrow_limit(driver):
    try:
        for _ in range(4):
            book_element = driver.find_element(By.XPATH, "//button[text()='Borrow']")
            book_element.click()
            time.sleep(1)
    except NoSuchElementException:
        logging.warning("No more books available to borrow.")
    
    try:
        alert = driver.switch_to.alert
        assert "Borrowing limit exceeded" in alert.text, "Borrow limit alert not shown"
        logging.info("Borrowing limit alert displayed successfully.")
        alert.accept()
    except UnexpectedAlertPresentException:
        logging.error("Borrow limit alert not found.")

# Test Scenario 5: Return a Book
def test_return_book(driver, book_name):
    try:
        return_button = driver.find_element(By.XPATH, f"//div[text()='{book_name}']/following-sibling::button[text()='Return']")
        return_button.click()
        time.sleep(2)
        borrow_count = driver.find_element(By.ID, "borrow-count").text
        logging.info(f"Returned '{book_name}' successfully. Count updated to {borrow_count}")
    except NoSuchElementException:
        logging.error(f"Return button for '{book_name}' not found.")

# Test Scenario 6: Due Date Alerts
def test_due_date_alert(driver):
    try:
        overdue_alert = driver.find_element(By.ID, "overdue-alert")
        assert "overdue" in overdue_alert.text.lower(), "No overdue alert displayed"
        logging.info("Overdue alert displayed successfully.")
    except NoSuchElementException:
        logging.error("Overdue alert not found.")

# Run tests on different browsers
def run_tests_on_browsers(url):
    for browser in ["chrome", "firefox", "edge"]:
        driver = None
        try:
            driver = setup_browser(browser)
            logging.info(f"Testing on {browser}")
            driver.get(url)
            sign_in(driver)  # Ensure sign-in before tests
            
            # Run all test scenarios
            test_page_load(driver, url)
            test_search_book(driver, "Python Automation")
            test_borrow_book(driver, "Python Automation")
            test_borrow_limit(driver)
            test_return_book(driver, "Python Automation")
            test_due_date_alert(driver)
        
        except Exception as e:
            logging.error(f"Error in {browser}: {str(e)}")
        finally:
            if driver:
                driver.quit()

# Run tests on all browsers
if __name__ == "__main__":
    run_tests_on_browsers("https://e-library-prakhar-frugal.vercel.app/")  # Update with the correct E-Library URL
