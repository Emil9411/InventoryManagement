using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class PossibleRework2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Item",
                table: "Item");

            migrationBuilder.RenameTable(
                name: "Item",
                newName: "Restaurant3Items");

            migrationBuilder.RenameIndex(
                name: "IX_Item_Name",
                table: "Restaurant3Items",
                newName: "IX_Restaurant3Items_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Restaurant3Items",
                table: "Restaurant3Items",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Restaurant3Items",
                table: "Restaurant3Items");

            migrationBuilder.RenameTable(
                name: "Restaurant3Items",
                newName: "Item");

            migrationBuilder.RenameIndex(
                name: "IX_Restaurant3Items_Name",
                table: "Item",
                newName: "IX_Item_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Item",
                table: "Item",
                column: "Id");
        }
    }
}
