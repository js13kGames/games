# This file will compress the relevant game files and show you the size of the compressed folder
# The purpose being to rapidly check whether or not additional files are beyond the size limit


# helper function to format file sizes
Function Format-FileSize() {
    Param ([int]$size)
    If ($size -gt 1TB) {[string]::Format("{0:0.00} TB", $size / 1TB)}
    ElseIf ($size -gt 1GB) {[string]::Format("{0:0.00 } GB", $size / 1GB)}
    ElseIf ($size -gt 1MB) {[string]::Format("{0:0.00 } MB", $size / 1MB)}
    ElseIf ($size -gt 1KB) {[string]::Format("{0:0.00} kB", $size / 1KB)}
    ElseIf ($size -gt 0) {[string]::Format("{0:0.00} B", $size)}
    Else {""}
}

# set variables with global scope
$ZipFileResult = "test.zip"  # provide path for zip file
$Dir = "./" # provide path for directory containing files to be zipped 

# this may be terrible logic and absolute worst practice in powershell but it works so screw it
[String]$files=Get-ChildItem -Path ./ 
$filenames = $files.split(' ')
$size = 0
$cleanedFileNames = @()
$cleanedFileSizes = @()

foreach ($file in $filenames)
{
    if (($file -ne "compressor.ps1") -and ($file -ne "README.md"))
    {
        #$newLetters = $newLetters + $letter
        $cleanedFileNames = $cleanedFileNames += $file
        $size = Format-FileSize((Get-Item $file).length)
        $cleanedFileSizes = $cleanedFileSizes += $size
        Write-Host $file ----> $size
    }
}


Get-ChildItem -Path $Dir  | 
           Where-Object { $_.Name -notin "compressor.ps1"} |
                 Where-Object {$_.Name -notin "README.md"} |
                    Compress-Archive -DestinationPath $ZipFileResult



if (Test-Path $ZipFileResult) {
     $thing = (Get-Item $ZipFileResult).length -gt 13kb 
     Write-Host Are you over the 13kb limit?: $thing
     $zipSize = Format-FileSize((Get-Item $ZipFileResult).length)
     Write-Host Size of your compressed files: $zipSize
}

Remove-Item $ZipFileResult






