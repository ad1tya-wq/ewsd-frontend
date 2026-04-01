from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("http://localhost:3000")
wait = WebDriverWait(driver, 10)

# --- Login ---
driver.find_element(By.CSS_SELECTOR, '[data-testid="login-employee-id"]').send_keys("DR001")
driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]').send_keys("sepsis123")
driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()

# --- Dashboard loaded ---
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="ward-dashboard"]')))
assert driver.find_element(By.CSS_SELECTOR, '[data-testid="stat-high"]').is_displayed()

# --- Click a high-risk patient card ---
driver.find_element(By.CSS_SELECTOR, '[data-testid="patient-card-P004"]').click()

# --- Detail page loaded ---
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="patient-detail-P004"]')))
chart = driver.find_element(By.CSS_SELECTOR, '[data-testid="vitals-chart-P004"]')
assert chart.is_displayed()

# --- Acknowledge alert ---
ack_btn = driver.find_element(By.CSS_SELECTOR, '[data-testid="alert-ack-btn-AL001"]')
ack_btn.click()

# --- Back to dashboard ---
driver.find_element(By.CSS_SELECTOR, '[data-testid="back-to-dashboard"]').click()
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="ward-dashboard"]')))

driver.quit()
print("All tests passed.")