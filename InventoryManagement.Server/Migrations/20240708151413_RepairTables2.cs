using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class RepairTables2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Item",
                table: "Item");

            migrationBuilder.RenameTable(
                name: "Item",
                newName: "Restaurant3");

            migrationBuilder.RenameIndex(
                name: "IX_Item_Name",
                table: "Restaurant3",
                newName: "IX_Restaurant3_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Restaurant3",
                table: "Restaurant3",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Restaurant3",
                table: "Restaurant3");

            migrationBuilder.RenameTable(
                name: "Restaurant3",
                newName: "Item");

            migrationBuilder.RenameIndex(
                name: "IX_Restaurant3_Name",
                table: "Item",
                newName: "IX_Item_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Item",
                table: "Item",
                column: "Id");
        }
    }
}
