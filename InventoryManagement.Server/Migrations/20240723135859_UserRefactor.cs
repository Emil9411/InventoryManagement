using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class UserRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Inventories_ManagedInventoryId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ManagedInventoryId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ManagedInventoryId",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ManagedInventoryId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ManagedInventoryId",
                table: "AspNetUsers",
                column: "ManagedInventoryId",
                unique: true,
                filter: "[ManagedInventoryId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Inventories_ManagedInventoryId",
                table: "AspNetUsers",
                column: "ManagedInventoryId",
                principalTable: "Inventories",
                principalColumn: "InventoryId");
        }
    }
}
