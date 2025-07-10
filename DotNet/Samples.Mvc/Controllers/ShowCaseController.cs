using Microsoft.AspNetCore.Mvc;

namespace Samples.Mvc.Controllers;

public class ShowCaseController : Controller
{
    public IActionResult Index(string caseName)
    {
        if (string.IsNullOrEmpty(caseName))
        {
            return NotFound();
        }
        ViewData["CaseName"] = caseName;
        return View();
    }

    [HttpPost]
    public IActionResult ActionHandler(string caseName)
    {
        // Example: handle actions for each case
        switch (caseName)
        {
            case "StreamingProgress":
                var file = Request.Form.Files["file"];
                TempData["Message"] = $"StreamingProgress action handled {file?.FileName}.";
                break;
            case "Privacy":
                // Handle Privacy-specific POST logic here
                TempData["Message"] = "Privacy action handled.";
                break;
            // Add more cases as needed
            default:
                TempData["Message"] = $"No handler for case: {caseName}";
                break;
        }
        return RedirectToAction("Index", new { caseName });
    }
}
