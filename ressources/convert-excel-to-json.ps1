# PowerShell script to convert Excel to JSON
# Requires Excel to be installed

$excelFile = Join-Path $PSScriptRoot "Copy of Programme nutritionnel & sportif Paul Youssef.xlsx"
$outputFolder = $PSScriptRoot

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    $workbook = $excel.Workbooks.Open($excelFile)
    
    Write-Host "Found $($workbook.Sheets.Count) sheets in the workbook"
    
    foreach ($sheet in $workbook.Sheets) {
        $sheetName = $sheet.Name
        $csvFile = Join-Path $outputFolder "$sheetName.csv"
        
        Write-Host "Exporting sheet: $sheetName"
        
        # Save as CSV
        $sheet.SaveAs($csvFile, 6) # 6 = xlCSV format
        
        Write-Host "  -> Saved to: $csvFile"
    }
    
    $workbook.Close($false)
    $excel.Quit()
    
    # Clean up COM objects
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host "`nConversion complete! CSV files saved in: $outputFolder"
    Write-Host "`nNext steps:"
    Write-Host "1. Review the CSV files"
    Write-Host "2. Let me know when ready to proceed with integration"
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nIf Excel is not installed, you can:"
    Write-Host "1. Open the Excel file"
    Write-Host "2. Save each sheet as CSV manually"
    Write-Host "3. Or use an online converter"
}
