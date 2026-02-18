# Generated manually for survey (risk profile + completed_at)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_customuser_is_google_account'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='risk_profile',
            field=models.CharField(
                blank=True,
                choices=[('aggressive', 'Agresywny (±80%)'), ('moderate', 'Umiarkowany (±20%)'), ('safe', 'Bezpieczny (±4%)')],
                help_text='Profil ryzyka z ankiety: agresywny/umiarkowany/bezpieczny',
                max_length=20,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name='customuser',
            name='survey_completed_at',
            field=models.DateTimeField(
                blank=True,
                help_text='Kiedy użytkownik ukończył ankietę (null = nie ukończona)',
                null=True,
            ),
        ),
    ]
