using System;
using System.IO;
using System.Text;

namespace F_B_ERP_POS_Inventory.Application.Hardware
{
    /// <summary>
    /// ESC/POS Raw Command Generator for Thermal Printers (80mm/58mm) and Cash Drawer Kick.
    /// Implements Phase 13 Hardware Interface spec.
    /// </summary>
    public class EscPosPrinterService
    {
        private static readonly byte[] EscInit = new byte[] { 0x1B, 0x40 }; // ESC @
        private static readonly byte[] EscCutPaper = new byte[] { 0x1D, 0x56, 0x41, 0x00 }; // GS V A 0
        private static readonly byte[] EscOpenCashDrawer = new byte[] { 0x1B, 0x70, 0x00, 0x19, 0xFA }; // ESC p 0 25 250

        public byte[] GenerateReceiptBytes(string orderNumber, string tableName, string totalAmountStr)
        {
            using var ms = new MemoryStream();
            ms.Write(EscInit, 0, EscInit.Length);

            string content = $"================================\n" +
                             $"    F&B ERP POS RECEIPT        \n" +
                             $"================================\n" +
                             $"Order: {orderNumber}\n" +
                             $"Table: {tableName}\n" +
                             $"Date : {DateTime.Now:yyyy-MM-dd HH:mm}\n" +
                             $"--------------------------------\n" +
                             $"TOTAL: {totalAmountStr} VND\n" +
                             $"================================\n" +
                             $"   Thank you & See you again!   \n\n\n";

            byte[] textBytes = Encoding.UTF8.GetBytes(content);
            ms.Write(textBytes, 0, textBytes.Length);

            // Cut Paper & Open Cash Drawer
            ms.Write(EscCutPaper, 0, EscCutPaper.Length);
            ms.Write(EscOpenCashDrawer, 0, EscOpenCashDrawer.Length);

            return ms.ToArray();
        }
    }
}
