using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class PostgresContext : DbContext
{
    public PostgresContext()
    {
        this.Host = Environment.GetEnvironmentVariable("PGHOST") ?? "locahost";
        this.Port = Environment.GetEnvironmentVariable("PGPORT") ?? "5000";
        this.Db = Environment.GetEnvironmentVariable("PGDATABASE") ?? "postgres";
        this.Username = Environment.GetEnvironmentVariable("PGUSER") ?? "postgres";
        this.Password = Environment.GetEnvironmentVariable("PGPASSWORD") ?? "postgres";
    }

    public PostgresContext(DbContextOptions<PostgresContext> options)
        : base(options)
    {
        this.Host = Environment.GetEnvironmentVariable("PGHOST") ?? "locahost";
        this.Port = Environment.GetEnvironmentVariable("PGPORT") ?? "5000";
        this.Db = Environment.GetEnvironmentVariable("PGDATABASE") ?? "postgres";
        this.Username = Environment.GetEnvironmentVariable("PGUSER") ?? "postgres";
        this.Password = Environment.GetEnvironmentVariable("PGPASSWORD") ?? "postgres";
    }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public string Host { get; set; }
    public string Port { get; set; }
    public string Db { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        optionsBuilder.UseNpgsql($"Host={this.Host}:{this.Port}; Database={this.Db}; Username={this.Username}; Password={this.Password}", builder =>
        {
            builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
        });
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => new { e.User, e.Id }).HasName("favorites_user_id");

            entity.ToTable("favorites");

            entity.Property(e => e.User)
                .HasMaxLength(16)
                .HasColumnName("user");
            entity.Property(e => e.Id)
                .HasMaxLength(64)
                .HasColumnName("id");
            entity.Property(e => e.Type)
                .HasMaxLength(16)
                .HasColumnName("type");

            entity.HasOne(d => d.UserNavigation).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.User)
                .HasConstraintName("favorites_user_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("pk_user");

            entity.ToTable("users");

            entity.Property(e => e.Name)
                .HasMaxLength(16)
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(64)
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasMaxLength(8)
                .HasColumnName("role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
