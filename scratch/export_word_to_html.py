import win32com.client
import os
import shutil

DOC_PATH = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\PetSolutions_Product_Details_01 - 04.docx"
EXPORT_DIR = r"C:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\scratch\word_export"
HTML_PATH = os.path.join(EXPORT_DIR, "export.htm")

os.makedirs(EXPORT_DIR, exist_ok=True)

print("Starting Word automation...")
word = win32com.client.Dispatch("Word.Application")
word.Visible = False
word.DisplayAlerts = False

try:
    print(f"Opening {DOC_PATH}...")
    doc = word.Documents.Open(DOC_PATH, ReadOnly=True, ConfirmConversions=False)
    print(f"Opened successfully: {doc.Name} with {doc.Paragraphs.Count} paragraphs, {doc.InlineShapes.Count} shapes")
    
    # Save as HTML (Filtered HTML = 10, HTML = 8)
    print("Exporting as HTML...")
    doc.SaveAs2(HTML_PATH, FileFormat=10) # 10 = wdFormatFilteredHTML
    doc.Close(SaveChanges=False)
    print("Word document exported to HTML successfully!")
finally:
    word.Quit()
